<?php
class Users{
 
    // database connection and table name
    private $conn;
    private $table_name = "users";
 
    // object properties
    public $user;
    public $pass;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read products
    function checkCredentials($user, $password){
    
        // select all query
        $query = "SELECT us.password FROM " . $this->table_name . " us WHERE user=? AND password=?";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $user);
        $stmt->bindParam(2, $password);
    
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }

    // read products with pagination
    public function readPaging($from_record_num, $records_per_page){
    
        // select query
        $query = "SELECT
                    av.average_flow, av.date
                FROM
                    " . $this->table_name . " av
                ORDER BY av.date DESC
                LIMIT ?, ?";
    
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
    
        // bind variable values
        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);
    
        // execute query
        $stmt->execute();
    
        // return values from database
        return $stmt;
    }

    // used for paging products
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";
    
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        return $row['total_rows'];
    }

    // create product
    function create(){
 
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    date=:datetime, average_flow=:value";
    
        // prepare query
        $stmt = $this->conn->prepare($query);

        
        // sanitize
        //$this->date=htmlspecialchars(strip_tags($this->date));
        //$this->value=htmlspecialchars(strip_tags($this->value));
        
        // bind values
        $stmt->bindParam(":datetime", $this->datetime);
        $stmt->bindParam(":average_flow", floatval($this->value));
        
    
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
        
    }

    function createMultiple($array) {
        // query to insert record

        $func = function($obj){
            // set product property values
            //$dt_temp = new Date($obj->date);
            //$obj->date = $dt_temp->format('Y-m-d H:i:s');
            //$obj->value = floatval($obj->value);
            //$format = ('d-m-Y H:i:s');
            //$datetime = DateTime::createFromFormat($format, $obj->date);
            return "('". $obj->date . "', " . floatval($obj->value) . ")";
        };

        $values = array_map($func, $array);
        $value2 = implode(", ", $values);
        //Inserting records into the database
        $query = "INSERT INTO " . $this->table_name . " (date, average_flow) VALUES ".$value2." ON DUPLICATE KEY UPDATE average_flow = average_flow;";
        // prepare query
        $stmt = $this->conn->prepare($query);
        var_dump($query);
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }

}