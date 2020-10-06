<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/avg_flow.php';
 
// instantiate database and accumulated value object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$avgFlow = new AverageFlow($db);
 
// query accumulated values
$stmt = $avgFlow->read();
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
            "date" => $date,
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
?>