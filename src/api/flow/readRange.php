<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/avg_flow.php';
 
// utilities
$utilities = new Utilities();
 
// instantiate database and flow object
$database = new Database();
$db = $database->getConnection();

// initialize object
$avg_flow = new AverageFlow($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(!empty($data->year) && isset($data->year) && !empty($data->month) && isset($data->month)){

    // query flow
    $stmt = $avg_flow->readMonth($data->year, $data->month);
    $num = $stmt->rowCount();

    // check if more than 0 record found
    if($num>0){
    
        // products array
        $avgFlow_arr=array();
        $avgFlow_arr["records"]=array();
    
        // retrieve our table contents
        // fetch() is faster than fetchAll()
        // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);
    
            $avgFlow_item=array(
                "datetime" => $date,
                "avg_flow" => $average_flow
            );
    
            array_push($avgFlow_arr["records"], $avgFlow_item);
        }
    
        // set response code - 200 OK
        http_response_code(200);
    
        // show products data in json format
        echo json_encode($avgFlow_arr);
    }
    
    else{
    
        // set response code - 404 Not found
        http_response_code(404);
    
        // tell the user no values found
        echo json_encode(
            array("message" => "No values found.")
        );
    }
} else {

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create entry. Data is incomplete."));

}
?>