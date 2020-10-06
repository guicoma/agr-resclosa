<?php
// include database and object files
include_once '../config/core.php';
// get database connection
include_once '../config/database.php';
 
// instantiate product object
include_once '../objects/users.php';

// required headers
header("Access-Control-Allow-Origin: {$home_url}");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


// get database connection
include_once '../config/database.php';

// instantiate product object
include_once '../objects/users.php';

$database = new Database();
$db = $database->getConnection();

// instantiate user object
$users = new Users($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));
$entityBody = file_get_contents('php://input');

var_dump($data);
var_dump($entityBody);
die("ole");

// make sure data is not empty
if(!empty($data->username) && isset($data->password)){

    // set product property values
    $user = $data->username;
    $pass = $data->password;
 
    // generate json web token
    include_once 'config/core.php';
    include_once 'libs/php-jwt/src/BeforeValidException.php';
    include_once 'libs/php-jwt/src/ExpiredException.php';
    include_once 'libs/php-jwt/src/SignatureInvalidException.php';
    include_once 'libs/php-jwt/src/JWT.php';

    if(true){
        
        $token = array(
            "iss" => $iss,
            "aud" => $aud,
            "iat" => $iat,
            "nbf" => $nbf,
            "data" => array(
                "username" => $user->firstname,
                "lastname" => $user->lastname,
                "email" => $user->email
            )
        );
      
        // set response code
        http_response_code(200);
      
        // generate jwt
        $jwt = JWT::encode($token, $key);
        echo json_encode(
            array(
                "message" => "Successful login.",
                "jwt" => $jwt
            )
        );

    } else {
    
        // set response code
        http_response_code(401);
    
        // tell the user login failed
        echo json_encode(array("message" => "Login failed."));
    }
} else {

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create entry. Data is incomplete."));

}

?>