<?php
require '../setup.php';
header("Content-type: application/json");

	$conn = connect();
	if (!$conn) {
		echo json_encode(array('ships' => array()));
		exit;
	}

  $tic = $_GET['tic'];
	$result = pg_query($conn, "SELECT * FROM my_ships_flight_recorder WHERE tic=" . $tic);
	if (!$result) {
		echo json_encode(array('ships' => array()));
		exit;
	}

	$arr = pg_fetch_all($result);
	$ships = json_encode(array('ships' => $arr));
	echo $ships;
	pg_close($conn);
?>
