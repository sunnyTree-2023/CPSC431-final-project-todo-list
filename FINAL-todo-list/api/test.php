
<?php
// Porject name: CPSC 431 Final Project - ToDo List 
// File name:  test.php
// Date : May 19 2023
// Author: Jiu Lin  

// Uncomment if you need to have detailed error reporting
// error_reporting(E_ALL);

// Include the Handler class so we can use it. 
require("helpers/handler.php");

// Create a new request handler. 
$handler = new Handler();

// Process the request
$handler->process();

// Handler Functions

// process /api/test on a GET request
function GET(Handler $handler)
{
    // It is common to have multiple types of get requests depending on
    // if you want 1 or multiple records or need to filter, etc. 
    // You can write alternate functions and use this one to decide which one to execute
    if (array_key_exists("id", $handler->request->get)) {
        getSingle($handler, $handler->request->get["id"]);
    } else {
        getList($handler);
    }
}


// api/test.php?id=123 would execute this function
function getSingle(Handler $handler, $id)
{
    // Use the $id and output just 1 thing

    $pdo = $handler->db->PDO();

    $query = "SELECT * FROM `list` WHERE idx=(?)";
    //$query = "SELECT * FROM `items` WHERE list_idx=(?)";

    $statement = $pdo->prepare($query);

    $statement->execute([$id]);  // ans: array :[$id,$name,$address]

    $result = $statement->fetchAll();

    $handler->response->json($result);
}


// api/test.php would execute this function
function getList(Handler $handler)
{
    $pdo = $handler->db->PDO();

    // get all lists from list table 
    $query = 'CALL get_lists()';  

    $statement = $pdo->prepare($query);

    $statement->execute();    // What is the different between this with line 40 execute() ?

    $results = $statement->fetchAll();

    // ** Different between them ??? **
    
    $handler->response->json($results);  // JSON string
}


// process api/test.php on a POST request
function POST(Handler $handler)
{
   // Mine
    $pdo = $handler->db->PDO();

    $parameter = [":name" => $handler->request->input["name"]]; //js object, name => userinput
    //request to get =>  users submit to the form

    //INSERT INTO `list` (name) VALUES (input_listname);
    $query = 'CALL insert_list(:name);';  //mySQL function  where this statement used ? 

    $statement = $pdo->prepare($query);

    //execute() should have the list name parameter 
    $statement->execute($parameter);    // What is the different between this with line 40 execute() ?

    $results = $statement->fetchAll();

    // ** Different between them ??? **
    
    $handler->response->json($results);  // JSON string
}


// process api/test.php on a PUT request
function PUT(Handler $handler)
{
    // You could include an id in the URL as a get variable
    // But more likely it's already in the input data being sent via request->input. 
    // Connect to the DB and execute the necessary query to update the record (row). 
       $pdo = $handler->db->PDO();
       $listIdx = $handler->request->input["listidxhtml"];
       $listname = $handler->request->input["newlistnamehtml"];
   
       $query = "CALL update_list_name(?, ?)";
       // $query = "CALL update_list_name(:newlistnamehtml, :newlistnamehtml)";
       //  UPDATE `list` SET name = input_name  WHERE idx = input_idx;
   
       $PDO = $handler->db->PDO();
   
       $statement = $PDO->prepare($query);
   
       $statement->execute([$listname, $listIdx]); 
   
       $result = $statement->fetchAll();
   
       $handler->response->json($result);
}


// process api/test.php on a DELETE request
// fetching to "api/test.php?id=123" with "DELETE" as the method
// will execute this function
function DELETE(Handler $handler)
{
    // It's common to send a specific id so we know 
    // which resource to delete
    // The method here is "DELETE" but we still have access to 
    // get variables since they are part of the URL. 


    // Here you would connect to the DB and use $id as a parameter
    // To delete the resource (row) with a matching id. 
    // Ans: Connecting to DB in php
    $pdo = $handler->db->PDO();

    $dix = $handler->request->get["idx"];

    // Ans: Prepare the delete statement with a placeholder for the id 
    // $query = "DELETE FROM `list` WHERE idx=(?)";
    $query = "CALL delete_list(?)";

    $stmt = $pdo->prepare($query);

    // Ans: Execute the statement
    $stmt->execute([$dix]);

    $result = [ "status" => "ok" ];
    // $result = [ "status" => "delete successfully" ];

    $handler->response->json($result);
}
