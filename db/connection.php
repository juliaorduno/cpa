<?php

    $serverName = "juliapaola\sqlexpress"; //serverName\instanceName

    // Since UID and PWD are not specified in the $connectionInfo array,
    // The connection will be attempted using Windows Authentication.
    $connectionInfo = array( "Database"=>"cpa");
    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( $conn ) {
        echo "Connection established.<br />";
    }else{
        echo "Connection could not be established.<br />";
        die( print_r( sqlsrv_errors(), true));
    }

    /*$connection->set_charset("utf8");
    switch($_GET["request"]){
        case 0:
            $indicators = array("Efectividad de Cierre", "Otro indicador");
            $indicator_id = $_GET["indicator_id"];
            $result = $indicators[$indicator_id];
            $result->fetch_object();
            echo json_encode($result->fetch_object(),JSON_UNESCAPED_UNICODE);
            $result->close();
            break;
    }
$serverName = "serverName\sqlexpress"; //serverName\instanceName
$connectionInfo = array( "Database"=>"dbName", "UID"=>"userName", "PWD"=>"password");
$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn ) {
     echo "Connection established.<br />";

}else{
     echo "Connection could not be established.<br />";
     die( print_r( sqlsrv_errors(), true));
}*/
?>