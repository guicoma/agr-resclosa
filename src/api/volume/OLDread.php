<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/acc_volume.php';
 
// instantiate database and accumulated value object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$accVolume = new AccumulatedVolume($db);
 
// query accumulated values
$stmt = $accVolume->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // products array
    $accVolume_arr=array();
    $accVolume_arr["records"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $accVolume_item=array(
            "date" => $date,
            "volume_acc" => $volume_acc
        );
 
        array_push($accVolume_arr["records"], $accVolume_item);
    }
 
    // set response code - 200 OK
    http_response_code(200);
 
    // show products data in json format
    echo json_encode($accVolume_arr);
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