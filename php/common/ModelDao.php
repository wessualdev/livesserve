<?php

namespace Dao;

include 'properties.php';

class Model{


    function getAll($model){
        //creo la query para obtener todo
        $sql =  "SELECT * FROM " . DB_NAME . "." . $model->table . " WHERE active = true";
        //consigo la conexión
        $connection = getConn();

        //ejecuto la query y devuelvo el resultado
        $result = $connection->query($sql);

       $resultArray = $this->toArray($result, $model);

        return $resultArray;
    }

    function executeCustomQuery($model, $query){

        //añado la tabla de la consulta
        $sql = str_replace("DBTABLE", DB_NAME . "." . $model->table, $query);

        $connection = getConn();

        //ejecuto la query y devuelvo el resultado
        $result = $connection->query($sql);

        $resultArray = $this->toArray($result, $model);

        return $resultArray;
    }

    function getAllWhere($model, $where){

        //añado el where a la petición de obtener todo
        $sql =  "SELECT * FROM " . DB_NAME . "." . $model->table . " WHERE " . $where;
        
        //consigo la conexión
        $connection = getConn();

        //ejecuto la query y devuelvo el resultado
        $result = $connection->query($sql);

        $resultArray = $this->toArray($result, $model);

        return $resultArray;
    }

    function getById($id, $model){

        $sql =  "SELECT * FROM " . DB_NAME . "." . $model->table . " WHERE id = " . $id;

        //consigo la conexión
        $connection = getConn();
        //ejecuto la query y devuelvo el resultado
        $result = $connection->query($sql);

        return $result->fetch_array(MYSQLI_ASSOC);
    }

    function virtualDelete($id, $model){

        $sql = "UPDATE " . DB_NAME . "." . $model->table . " SET active = false WHERE id = " . $id;

         //consigo la conexión
         $connection = getConn();
         //ejecuto la query
         $result = $connection->query($sql);
 
         return $result;
    }

    public function update($model, $id){
        $columns = [];
        $index = 0;
        $sets = "";

        foreach ($model as $key => $value) {

            if ($key != 'table' && $key != 'types' && $key != 'id') {
                $concat = "";
                $quotes = "'";
                //si el index es mayor que 0 añade un , antes de vada columna y cada valor
                if($index > 0){
                    $concat = ",";
                }
                //dependiendo el tipo de dato le quito las comillas al value
                $dataType = $model->types[$index];

                if($dataType == "boolean" || $dataType == "number"){
                    $quotes = "";
                }
                //concateno las columnas y su valor
                $sets = $sets . $concat . $key . " = " . $quotes . $value . $quotes;

                $index++;
            }
            
        }

        $sql = "UPDATE " . DB_NAME . "." . $model->table . " SET " . $sets . " WHERE id = " . $id;
       
        //return $sql;

        //consigo la conexión
        $connection = getConn();
        //ejecuto la query
        $result = $connection->query($sql);

        return $result;
    }

    public function insert($model) {
        $columns = [];
        $index = 0;
        $columns = "";
        $values = "";

        foreach ($model as $key => $value) {

            if ($key != 'table' && $key != 'types' && $key != 'id') {
                $concat = "";
                $quotes = "'";
                //si el index es mayor que 0 añade un , antes de vada columna y cada valor
                if($index > 0){
                    $concat = ",";
                }
                //dependiendo el tipo de dato le quito las comillas al value
                $dataType = $model->types[$index];

                if($dataType == "boolean" || $dataType == "number"){
                    $quotes = "";
                }
                //concateno las columnas y su valor
                $columns = $columns . $concat . $key;
                $values = $values . $concat . $quotes. $value . $quotes;

                $index++;
            }
            
        }

        $sql = "INSERT INTO " . DB_NAME . "." . $model->table . " (" . $columns . ") VALUES (" . $values . ")";
       
        //return $sql;

        //consigo la conexión
        $connection = getConn();
        //ejecuto la query
        $result = $connection->query($sql);

        return $result;
    }

    function toArray($result, $model){
        $numRes = $result->num_rows;
        $index = 0;

        $returnArray = array();

        //recorro todas las entradas
        while ($numRes > $index){
            //parseo cada entrada en el objeto deseado y lo
            $model = $result->fetch_array(MYSQLI_ASSOC);

            array_push($returnArray, $model);
            
            $index++;
        }
        
        return $returnArray;
    }

    
}