<?php
class AccumulatedVolume{
 
    // database connection and table name
    private $conn;
    private $table_name = "accumulated_volume";
 
    // object properties
    public $datetime;
    public $value;
    public $arrayValues;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read products
    function read(){
    
        // select all query
        $query = "SELECT
                    av.volume_acc, av.date
                FROM
                    " . $this->table_name . " av
                ORDER BY
                    date ASC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }

    // read products with pagination
    public function readPaging($from_record_num, $records_per_page){
    
        // select query
        $query = "SELECT
                    av.volume_acc, av.date
                FROM
                    " . $this->table_name . " av
                ORDER BY date ASC
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

    // read products with pagination
    public function readYear($year){
    
        $from_date = $year."-01-01 00:00:00";
        $till_date = $year."-12-31 23:59:59";
        // select query
        $query = "SELECT
                    af.volume_acc, af.date
                FROM
                    " . $this->table_name . " af
                WHERE af.date between '" . $from_date . "' and '" . $till_date . "'
                ORDER BY date ASC";
        
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
    
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
                    datetime=:datetime, volume_acc=:value";
    
        // prepare query
        $stmt = $this->conn->prepare($query);

        
        // sanitize
        //$this->datetime=htmlspecialchars(strip_tags($this->datetime));
        //$this->value=htmlspecialchars(strip_tags($this->value));
        
        // bind values
        $stmt->bindParam(":datetime", $this->datetime);
        $stmt->bindParam(":value", floatval($this->value));
        
    
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
            //$dt_temp = new DateTime($obj->datetime);
            //$obj->datetime = $dt_temp->format('Y-m-d H:i:s');
            //$obj->value = floatval($obj->value);
            $format = ('d-m-Y H:i:s');
            $datetime = DateTime::createFromFormat($format, $obj->datetime);
            return "('". $datetime->format('Y-m-d H:i:s') . "', " . floatval($obj->value) . ")";
        };

        $values = array_map($func, $array);
        $value2 = implode(", ", $values);
        //Inserting records into the database
        $query = "INSERT INTO " . $this->table_name . " (date, volume_acc) VALUES ".$value2." ON DUPLICATE KEY UPDATE volume_acc = volume_acc;";
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