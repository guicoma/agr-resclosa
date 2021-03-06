<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate product object
include_once '../objects/avg_flow.php';
 
$database = new Database();
$db = $database->getConnection();
 
$avg_flow = new AverageFlow($db);

$volume_entered = false;
 
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(!empty($data->avg_flow) && isset($data->avg_flow)){
    
    if($avg_flow->createMultiple($data->avg_flow)){
        
        // set response code - 201 created
        http_response_code(201);
     
        // tell the user
        echo json_encode(array("message" => "Entry was created."));
    } else {
    
        // set response code - 503 service unavailable
        http_response_code(503);
    
        // tell the user
        echo json_encode(array("message" => "Unable to create entry."));
    }
} else {

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create entry. Data is incomplete."));

}

?>