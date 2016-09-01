<?php

$serverName = "";
$connectionInfo = array("Database"=>"", "UID"=>"", "PWD"=>""); //user credentials
$conn = sqlsrv_connect($serverName, $connectionInfo);

$myquery = "SELECT TOP 20 campaign_name, campaign_id, reach from [dbo].[campaign_reach] order by reach desc";
$data = array();
$options = array("Scrollable" => SQLSRV_CURSOR_KEYSET);

$query = sqlsrv_query($conn, $myquery, $data, $options);



if (! $conn){
	echo "Connection could not be established.<br />";
	die( print_r( sqlsrv_errors(), true));
}

if (! $query){
	echo "Data cannot be fetched";
	die( print_r( sqlsrv_errors(), true));
}

for ($x = 0; $x < sqlsrv_num_rows($query); $x++){
	$data[] = sqlsrv_fetch_array($query, SQLSRV_FETCH_ASSOC);
}

$fp = fopen('d3.json', 'w');
fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
fclose($fp);

echo json_encode($data, JSON_PRETTY_PRINT);

sqlsrv_close($conn);

?>

