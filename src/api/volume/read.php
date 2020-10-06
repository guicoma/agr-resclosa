<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/acc_volume.php';
 
// utilities
$utilities = new Utilities();
 
// instantiate database and flow object
$database = new Database();
$db = $database->getConnection();

// initialize object
$acc_volume = new AccumulatedVolume($db);

// query flow
$stmt = $acc_volume->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){

    // flow array
    $acc_volume_arr=array();
    $acc_volume_arr["records"]=array();
    $acc_volume_arr["paging"]=array();

    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);

        $acc_volume_item=array(
            "datetime" => $date,
            "volume_acc" => $volume_acc
        );
 
        array_push($acc_volume_arr["records"], $acc_volume_item);
    }

    // include paging
    $total_rows=$acc_volume->count();
    $page_url="{$home_url}volume/read_paging.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $acc_volume_arr["paging"]=$paging;
 
    // set response code - 200 OK
    http_response_code(200);
 
    // make it json format
    echo json_encode($acc_volume_arr);
}
 
else{
 
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user flow does not exist
    echo json_encode(
        array("message" => "No values found.")
    );
}
?>