<?php

$serverName = "10.2.186.233,5721";
$connectionInfo = array("Database"=>"DM_3291_FrieslandSandbox", "UID"=>"btanabi", "PWD"=>""); //user credentials
$conn = sqlsrv_connect($serverName, $connectionInfo);

$myquery = "SELECT Campaign, sum(Cost)/sum(Clicks) as CPC, sum(Cost)/(sum(Impressions)/1000) as CPM, sum(Clicks) as Clicks, sum(Cost) as Cost, sum(Impressions) as Impressions 
			from [dbo].[DFID046508_DS003a_Adwords_AdPerformance_Extracted]
			where Clicks != 0 and Impressions != 0
			group by Campaign";
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

$fp = fopen('DS003a_Adwords_AdPerformance.json', 'w');
fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
fclose($fp);

echo json_encode($data, JSON_PRETTY_PRINT);

sqlsrv_close($conn);

?>


