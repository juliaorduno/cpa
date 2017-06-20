<?php
    
if(count($_GET) > 0 && isset($_GET["request"])){
    //$serverName = "juliapaola\sqlexpress";
    $serverName = "vmwinsiete\sqlexpress,1533";
    $connectionInfo = array( "Database"=>"cpa", "UID"=>"sa", "PWD"=>"a01630895","CharacterSet" => "UTF-8");
    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( $conn === false ) {
        die( print_r( sqlsrv_errors(), true));
    } else{
        switch($_GET["request"]){
            //Get all areas 
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

            //Login verification and get user info
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

            //Get manager department
            case 2:
                $user_id = $_GET["usuario_id"];
                $sql = "SELECT departamento_id, departamento FROM CPA_Departamento WHERE gerente_id = '$user_id'";
                $stmt = sqlsrv_query($conn,$sql);
                if($stmt === false){
                    die( print_r( sqlsrv_errors(), true));
                    echo 'Error';
                }else{
                    $dpt = sqlsrv_fetch_object($stmt);
                    echo json_encode($dpt,JSON_UNESCAPED_UNICODE);
                }
                
                sqlsrv_free_stmt($stmt);
                break;

            //Get department indicators
            case 3:
                $rows = array();
                $department_id = $_GET["department_id"];
                $sql = "SELECT indicador_id, indicador, area, rol, CPA_Indicador.rol_id, unidad, fuente, frecuencia 
                        FROM CPA_Indicador, CPA_Area, CPA_Rol, CPA_Unidad, CPA_Fuente, CPA_Frecuencia 
                        WHERE CPA_Area.area_id = CPA_Indicador.area_id
                            AND CPA_Rol.rol_id = CPA_Indicador.rol_id
                            AND CPA_Unidad.unidad_id = CPA_Indicador.unidad_id
                            AND CPA_Fuente.fuente_id = CPA_Indicador.fuente_id
                            AND CPA_Frecuencia.frecuencia_id = CPA_Indicador.frecuencia_id
                            AND CPA_Rol.departamento_id = $department_id
                        ORDER BY indicador";
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

            //Get all frequencies
            case 4:
                $sql = "SELECT frecuencia FROM CPA_Frecuencia";
                $stmt = sqlsrv_query($conn, $sql);
                if( $stmt === false ) {
                    die( print_r( sqlsrv_errors(), true));
                }
                while( $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC) ){
                    $rows[] = $row;
                }
                sqlsrv_free_stmt($stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Insert new indicator
            case 5:
                $indicator = $_GET["indicator"];
                $area_id = $_GET["area_id"];
                $role_id = $_GET["role_id"];
                $unit = $_GET["unit"];
                $frequency = $_GET["frequency"];
                $source = $_GET["source"];
                $department_id = $_GET["department_id"];

                $procedure_params = array( &$indicator,&$area_id,&$role_id,&$unit,&$source,&$frequency,&$department_id);

                $sql = "EXEC CPA_NuevoIndicador
                        @indicador = ?, @area_id = ?, @rol_id = ?, @unidad = ?, 
                        @fuente = ?, @frecuencia = ?, @dpt_id = ?";
                $stmt = sqlsrv_prepare($conn, $sql, $procedure_params);

                if( !$stmt ) {
                    die( print_r( sqlsrv_errors(), true));
                }
                if( sqlsrv_execute( $stmt ) === false ) {
                    die( print_r( sqlsrv_errors(), true));
                }
                sqlsrv_free_stmt($stmt);
                echo 'Enviado';
                break;

            //Get collaborators
            case 6:
                $department_id = $_GET["department_id"];
                $sql = "SELECT CONCAT(nombre, ' ', apellido) as nombre, empleado_id, rol 
                        FROM CPA_Empleado, CPA_Rol
                        WHERE CPA_Rol.rol_id = CPA_Empleado.rol_id 
                            AND CPA_Empleado.departamento_id = $department_id 
                            AND CPA_Empleado.activo = 'SI'";
                            
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
        }
        sqlsrv_close( $conn );
    }
}
?>