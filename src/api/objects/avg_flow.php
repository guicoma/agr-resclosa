<?php
class AverageFlow{
 
    // database connection and table name
    private $conn;
    private $table_name = "average_flow_hour";
 
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
                    af.date, af.average_flow
                FROM
                    " . $this->table_name . " af
                ORDER BY date ASC";
    
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
                    af.average_flow, af.date
                FROM
                    " . $this->table_name . " af
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
    public function readMonth($year, $month){
        $aux = intval($month);
        if($aux < 10){
            $month_padded = '0'.$month;
        } else {
            $month_padded = $month;
        }
        $from_date = $year . "-" . $month_padded . "-01 00:00:00";
        $till_date = $year . "-" . $month_padded . "-31 00:00:00";
        // select query
        $query = "SELECT
                    af.average_flow, af.date
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
            $format = ('d-m-Y H:i:s');
            $datetime = DateTime::createFromFormat($format, $obj->datetime);
            return "('". $datetime->format('Y-m-d H:i:s') . "', " . floatval($obj->value) . ")";
        };

        $values = array_map($func, $array);
        $value2 = implode(", ", $values);
        //Inserting records into the database
        $query = "INSERT INTO " . $this->table_name . " (date, average_flow) VALUES ".$value2." ON DUPLICATE KEY UPDATE average_flow = average_flow;";
        // prepare query
        $stmt = $this->conn->prepare($query);
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }

}