<?php

$logo = $_FILES["logo"];
$name = $logo["name"];

$target_file = "../../assets/imgs/" . $name;

move_uploaded_file($_FILES["logo"]["tmp_name"], $target_file);