<?php
    
if(count($_GET) > 0 && isset($_GET["request"])){
    $serverName = "juliapaola\sqlexpress";
    //$serverName = "vmwinsiete\sqlexpress,1533";
    $connectionInfo = array( "Database"=>"cpa", "UID"=>"sa", "PWD"=>"a01630895","CharacterSet" => "UTF-8");
    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    if( $conn === false ) {
        die( print_r( sqlsrv_errors(), true));
    } else{
        switch($_GET["request"]){
            //Get all areas 
            case 0:
                $sql = "SELECT area_id, area FROM CPA_Area WHERE activo = 'SI'";
                $stmt = sqlsrv_query( $conn, $sql);
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
                $sql = "SELECT e.nombre, e.empleado_id, e.rol, mt.mes, mt.final FROM
                            (SELECT CONCAT(nombre, ' ', apellido) as nombre, empleado_id, rol
                            FROM CPA_Empleado, CPA_Rol
                            WHERE CPA_Rol.rol_id = CPA_Empleado.rol_id 
                                AND CPA_Empleado.departamento_id = $department_id
                                AND CPA_Empleado.activo = 'SI') as e
                            LEFT JOIN
                            (SELECT m.mes, sq.empleado_id, f.final FROM CPA_Mes as m, ( 
                                SELECT MAX(CONVERT(int,mes_id)) AS mes, empleado_id
                                FROM CPA_CalificacionFinal
                                WHERE fechaFin IS NOT NULL
                                GROUP BY empleado_id) as sq, CPA_CalificacionFinal as f
                            WHERE m.mes_id = CONVERT(varchar(6), sq.mes)
                                AND f.mes_id = m.mes_id) as mt
                            ON e.empleado_id = mt.empleado_id";
                            
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Get collaborator grades
            case 7: 
                $collaborator_id = $_GET["collaborator_id"];
                $month_id = $_GET["month_id"];
                $sql = "SELECT mes_id, area_id, indicador, unidad, fuente, frecuencia, meta, minimo, real_obtenido, peso, porcentaje, calificacion
                        FROM CPA_CalificacionIndicador AS ci, (
                            SELECT indicador_id, indicador, unidad, fuente, frecuencia, i.area_id
                            FROM CPA_Indicador AS i, CPA_Unidad AS u, CPA_Fuente AS f, CPA_Frecuencia AS fr
                            WHERE i.unidad_id = u.unidad_id AND i.fuente_id = f.fuente_id AND fr.frecuencia_id = i.frecuencia_id) AS sq
                        WHERE ci.indicador_id = sq.indicador_id AND empleado_id = $collaborator_id AND mes_id = '$month_id'";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Get modifiers' types
            case 8:
                $area_id = $_GET["area_id"];
                $sql = "SELECT * 
                        FROM CPA_TipoModificador
                        WHERE area_id = $area_id";
                            
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Get modifiers
            case 9:
                $area_id = $_GET["area_id"];
                $sql = "SELECT sq.evento_id, sq.evento, u.unidad, sq.tipo_id, sq.area_id
                        FROM CPA_Unidad AS u RIGHT JOIN (
                            SELECT evento_id, evento, unidad_id, e.tipo_id, t.area_id
                            FROM CPA_Evento AS e, CPA_TipoModificador AS t
                            WHERE e.tipo_id = t.tipo_id AND area_id = $area_id) AS sq
                        ON u.unidad_id = sq.unidad_id";
                            
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Get available months por certain employee
            case 10:
                $collaborator_id = $_GET["collaborator_id"];
                $sql = "SELECT * 
                        FROM CPA_Mes 
                        WHERE exists (
                            SELECT DISTINCT mes_id 
                            FROM CPA_CalificacionIndicador 
                            WHERE mes_id = CPA_Mes.mes_id AND empleado_id = $collaborator_id)";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                if(!empty($rows)){
                    echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                } else {
                    echo "NO INFO";
                }
                break;

            //Get modifiers per month for an specific employee
            case 11:
                $collaborator_id = $_GET["collaborator_id"];
                $month_id = $_GET["month_id"];
                $sql = "SELECT area_id, evento, unidad, fuente
                        FROM CPA_TipoModificador AS t, (
                            SELECT evento, unidad, fuente, tipo_id
                            FROM CPA_Modificador AS m, CPA_Evento AS e, CPA_Fuente AS f, CPA_Unidad AS u
                            WHERE empleado_id = $collaborator_id AND mes_id = '$month_id'
                                AND m.evento_id = e.evento_id AND m.fuente_id = f.fuente_id 
                                AND e.unidad_id = u.unidad_id) AS sq
                        WHERE t.tipo_id = sq.tipo_id";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                if(!empty($rows)){
                    echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                }
                break;

            //Get final grade for certain month
            case 12:
                $collaborator_id = $_GET["collaborator_id"];
                $month_id = $_GET["month_id"];
                $sql = "SELECT parcial, final
                        FROM CPA_CalificacionFinal
                        WHERE empleado_id = $collaborator_id AND mes_id = '$month_id'";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                if(!empty($rows)){
                    echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                }
                break;

            //Get indicators for resume
            case 13:
                $collaborator_id = $_GET["collaborator_id"];
                $sql = "SELECT DISTINCT i.indicador_id, indicador, area_id 
                        FROM CPA_CalificacionIndicador c, CPA_Indicador i 
                        WHERE c.indicador_id = i.indicador_id AND empleado_id = $collaborator_id
                        ORDER BY area_id, indicador_id";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Get all grades for resume
            case 14:
                $collaborator_id = $_GET["collaborator_id"];
                $sql = "SELECT ci.indicador_id, mes_id, porcentaje, peso, calificacion, i.area_id 
                        FROM CPA_CalificacionIndicador AS ci, CPA_Indicador AS i
                        WHERE empleado_id = $collaborator_id AND ci.indicador_id = i.indicador_id
                        ORDER BY i.area_id, ci.indicador_id";
                $stmt = sqlsrv_query( $conn, $sql);
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