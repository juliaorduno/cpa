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
                        WHERE ci.indicador_id = sq.indicador_id 
                        AND empleado_id = $collaborator_id 
                        AND mes_id = '$month_id'
                        AND EXISTS (
							SELECT * FROM CPA_CalificacionFinal f WHERE fechaFin IS NOT NULL 
							AND ci.empleado_id = f.empleado_id AND ci.mes_id = f.mes_id)";
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
                            FROM CPA_CalificacionIndicador ci
                            WHERE mes_id = CPA_Mes.mes_id AND empleado_id = $collaborator_id
                            AND EXISTS (
                                SELECT * FROM CPA_CalificacionFinal f WHERE fechaFin IS NOT NULL 
                                AND ci.empleado_id = f.empleado_id AND ci.mes_id = f.mes_id))";
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
                                AND e.unidad_id = u.unidad_id
                                AND EXISTS (
                                    SELECT * FROM CPA_CalificacionFinal f WHERE fechaFin IS NOT NULL 
                                    AND m.empleado_id = f.empleado_id AND m.mes_id = f.mes_id)) AS sq
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
                        WHERE empleado_id = $collaborator_id AND mes_id = '$month_id'
                        AND fechaFin IS NOT NULL ";
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
                $sql = "SELECT DISTINCT i.indicador_id, indicador, i.area_id, area 
                        FROM CPA_CalificacionIndicador c, CPA_Indicador i, CPA_Area a
                        WHERE c.indicador_id = i.indicador_id 
                            AND empleado_id = $collaborator_id
                            AND i.area_id = a.area_id
                        ORDER BY i.area_id, indicador_id";
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
                $sql = "SELECT ci.indicador_id, ci.mes_id, porcentaje, peso, calificacion, i.area_id 
                        FROM CPA_CalificacionIndicador AS ci, CPA_Indicador AS i
                        WHERE ci.empleado_id = $collaborator_id 
                            AND ci.indicador_id = i.indicador_id
                            AND EXISTS (
							SELECT * FROM CPA_CalificacionFinal f WHERE fechaFin IS NOT NULL 
							AND ci.empleado_id = f.empleado_id AND ci.mes_id = f.mes_id)
                        ORDER BY i.area_id, ci.indicador_id";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Insert event
            case 15:
                $type_id = $_GET["type_id"];
                $event = $_GET["event"];
                $unit_id = $_GET["unit_id"];
                $sql = "INSERT INTO CPA_Evento(evento, unidad_id, tipo_id) VALUES (?,?,?)";
                $params = array("$event",$unit_id,$type_id); 
                $stmt = sqlsrv_query( $conn, $sql, $params);
                if( !$stmt ) {
                    echo 'No';
                    die( print_r( sqlsrv_errors(), true));
                }else{
                    echo 'Enviado';
                }
                sqlsrv_free_stmt($stmt);
                break;
            
            //Get all final grades per collaborator
            case 16:
                $collaborator_id = $_GET["collaborator_id"];
                $sql = "SELECT mes_id, parcial, final 
                        FROM CPA_CalificacionFinal
                        WHERE empleado_id = $collaborator_id AND fechaFin IS NOT NULL
                        ORDER BY mes_id";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                break;

            //Get events per month per collaborator
            case 17:
                $collaborator_id = $_GET["collaborator_id"];
                $month_id = $_GET["month_id"];
                $sql = "SELECT count(m.evento_id) AS eventos, tipo, area_id
                        FROM CPA_Modificador m, CPA_Evento e, CPA_TipoModificador t, CPA_CalificacionFinal f
                        WHERE m.evento_id = e.evento_id
                        AND m.mes_id = '$month_id'
                        AND m.empleado_id = $collaborator_id
                        AND fechaFin IS NOT NULL
						AND f.mes_id = m.mes_id
						AND f.empleado_id = m.empleado_id
                        AND t.tipo_id = e.tipo_id
                        GROUP BY tipo, area_id";
                /*$sql = "SELECT e.eventos, t.tipo_id
                        FROM CPA_TipoModificador t LEFT JOIN (
                            SELECT count(m.evento_id) AS eventos, tipo_id 
                            FROM CPA_Evento v, CPA_Modificador m
                            WHERE m.evento_id = v.evento_id 
                            AND empleado_id = $collaborator_id
                            AND mes_id = $month_id
                            GROUP BY tipo_id) e 
                        ON t.tipo_id = e.tipo_id ORDER BY t.tipo_id";*/
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                if(!empty($rows)){
                    echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                }
                break;

            //Get previous report
            case 18:
                $collaborator_id = $_GET["collaborator_id"];
                $sql = "SELECT ci.indicador_id, indicador, meta, minimo, peso, area_id 
                        FROM CPA_Indicador i, CPA_CalificacionIndicador ci, (
                            SELECT MAX(CONVERT(int,mes_id)) AS mes 
                            FROM CPA_CalificacionIndicador) sq
                        WHERE ci.indicador_id = i.indicador_id
                        AND mes_id = sq.mes
                        AND empleado_id = $collaborator_id";
                $stmt = sqlsrv_query( $conn, $sql);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rows[] = $row;
                }
                sqlsrv_free_stmt( $stmt);
                if(!empty($rows)){
                    echo json_encode($rows,JSON_UNESCAPED_UNICODE);
                }
                break;

            //Send indicator grades
            case 19:
                $collaborator_id = $_GET["collaborator_id"];
                $month_id = $_GET["month_id"];
                $indicator_id = $_GET["indicador_id"];
                $meta = $_GET["meta"];
                $minimo = $_GET["minimo"];
                $real_obtenido = $_GET["real"];
                $peso = $_GET["peso"];
                $porcentaje = $_GET["porcentaje"];
                $calificacion = $_GET["calificacion"];

                $procedure_params = array( &$collaborator_id,&$month_id,&$indicator_id,&$meta,&$minimo,
                    &$real_obtenido,&$porcentaje,&$peso,&$calificacion);

                $sql = "EXEC CPA_InsertarIndicadores
                        @empleado = ?, @mes = ?, @indicador_id = ?, @meta = ?, 
                        @minimo = ?, @real_obtenido = ?, @porcentaje = ?, @peso = ?, @calificacion = ?";
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
        }
        sqlsrv_close( $conn );
    }
}
?>