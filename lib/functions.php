<?php 

function loadTemplate($filename, array $assignData = []) {
    extract($assignData);
    include __DIR__.'/../template/'.$filename.'.tpl.php';
}

function error404() {
    //  HTTPレスポンスのヘッダを404にする
    header('HTTP/1.1 404 Not Found');

     // レスポンスの種類を指定する
    header('Content-Type: text/html; charset=UTF-8');

    loadTemplate('404');
    
    exit(0);
}

function fetchAll() {
    $handler = fopen(__DIR__.'/data.csv', 'r');

    $questions = [];
    while($row = fgetcsv($handler)){
        if(isDataRow($row)){
            $questions[] = $row;
        }
    }

    fclose($handler);

    return $questions;
}

function fetchById($id) {
    $handler = fopen(__DIR__.'/data.csv', 'r');

    $question = [];
    while($row = fgetcsv($handler)){
        if(isDataRow($row)){
            if($row[0] === $id) {
                $question = $row;
                break;
            }
        }
    }

    fclose($handler);

    return $question;
}

function isDataRow(array $row)
{
    // データの項目数が足りているか判定
    if (count($row) !== 8) {
        return false;
    }

    // データの項目の中身がすべて埋まっているか確認する
    foreach ($row as $value) {
        // 項目の値が空か判定
        if (empty($value)) {
            return false;
        }
    }

    // idの項目が数字ではない場合は無視する
    if (!is_numeric($row[0])) {
        return false;
    }

    // 正しい答えはa,b,c,dのどれか
    $correctAnswer = strtoupper($row[6]);
    $availableAnswers = ['A', 'B', 'C', 'D'];
    if (!in_array($correctAnswer, $availableAnswers)) {
        return false;
    }

    // すべてチェックが問題なければtrue
    return true;
}

function generateFormattedData($data)
{
    // 構造化した配列を作成する
    $formattedData = [
        'id' => escape($data[0]),
        'question' => escape($data[1], true),
        'answers' => [
            'A' => escape($data[2]),
            'B' => escape($data[3]),
            'C' => escape($data[4]),
            'D' => escape($data[5]),
        ],
        'correctAnswer' => escape(strtoupper($data[6])),
        'explanation' => escape($data[7], true),
    ];

    return $formattedData;
}

function escape($data, $nl2br = false)
{
    // HTMLに埋め込んでも大丈夫な文字に変換する
    $convertedData = htmlspecialchars($data, ENT_HTML5);

    // 改行コードを<br>タグに変換するか判定
    if ($nl2br) {
        /// 改行コードを<br>タグに変換したものをを返却
        return nl2br($convertedData);
    }

    return $convertedData;
}
