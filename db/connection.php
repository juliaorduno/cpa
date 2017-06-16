<?php
    
if(count($_GET) > 0 && isset($_GET["request"])){
    $serverName = "vmwinsiete\sqlexpress,1533";
    $connectionInfo = array( "Database"=>"cpa", "UID"=>"sa", "PWD"=>"a01630895","CharacterSet" => "UTF-8");
    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( $conn === false ) {
        die( print_r( sqlsrv_errors(), true));
    } else{
        switch($_GET["request"]){
            case 0:
                $sql = "SELECT area_id, area FROM CPA_Area";
                $stmt = sqlsrv_query( $conn, $sql);
                if( $stmt === false ) {
                    die( print_r( sqlsrv_errors(), true));
                }
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;
            case 1:
                $email = $_GET["email"];
                $password = $_GET["password"];
                $sql = "SELECT * FROM CPA_Usuario WHERE email = '$email' AND clave = '$password'";
                $stmt = sqlsrv_query($conn, $sql);
                if($stmt === false){
                    die( print_r( sqlsrv_errors(), true));
                }
                $user = sqlsrv_fetch_object( $stmt);
                if($user != null){
                    echo json_encode($user,JSON_UNESCAPED_UNICODE);
                }else{
                    echo "FAILED";
                }
                sqlsrv_free_stmt( $stmt);
                break;
        }
        sqlsrv_close( $conn );
    }
}
?>