<?php

$fileKey = isset($_POST['fileKey']) ? $_POST['fileKey'] : 'file';
$fileTypes = isset($_POST['fileTypes']) ? $_POST['fileTypes'] : '';
$outputDir = isset($_POST['directory']) ? $_POST['directory'] : '/var/tmp';

$messages = [
    'successFileUpload'     => isset($_POST['successFileUpload'])       ? $_POST['successFileUpload']       : 'File uploaded successfully',
    'errorFileUpload'       => isset($_POST['errorFileUpload'])         ? $_POST['errorFileUpload']         : 'Error: File not uploaded',
    'errorFileExists'       => isset($_POST['errorFileExists'])         ? $_POST['errorFileExists']         : 'Error: File not received',
    'errorFileSelect'       => isset($_POST['errorFileSelect'])         ? $_POST['errorFileSelect']         : 'Error: File not selected',
    'errorFileFormat'       => isset($_POST['errorFileFormat'])         ? $_POST['errorFileFormat']         : 'Error: Wrong File Format',
    'errorCreateDirectory'  => isset($_POST['errorCreateDirectory'])    ? $_POST['errorCreateDirectory']    : 'Error: Could not create destination directory',
    'errorAccessDirectory'  => isset($_POST['errorAccessDirectory'])    ? $_POST['errorAccessDirectory']    : 'Error: Directory access failed',
];

$error = false;
$message = $messages['successFileUpload'];

try {

    if (!empty($fileTypes)) {
        $acceptedFileTypes = explode(',', $fileTypes);
    }

    if (!is_dir($outputDir) && !mkdir($outputDir, 0775)) {
        throw new Exception($messages['errorCreateDirectory']);
    }

    if (!isset($_FILES) || !isset($_FILES[$fileKey])) {
        throw new Exception($messages['errorFileExists']);
    }

    if ($_FILES[$fileKey]['size'] === 0 && $_FILES[$fileKey]['tmp_name'] === 'none') {
        throw new Exception($messages['errorFileSelect']);
    }

    if ($_FILES[$fileKey]["error"] !== UPLOAD_ERR_OK) {
        throw new Exception($messages['errorFileUpload'] . ' (code ' . $_FILES[$fileKey]["error"] . ')');
    }

    if (isset($acceptedFileTypes) && array_search($_FILES[$fileKey]["type"], $acceptedFileTypes) === false) {
        throw new Exception($messages['errorFileFormat']);
    }

    if (!move_uploaded_file($_FILES[$fileKey]["tmp_name"], $outputDir . DIRECTORY_SEPARATOR . $_FILES[$fileKey]["name"])) {
        throw new Exception($messages['errorAccessDirectory']);
    }

} catch (Exception $e) {
    $error = true;
    $message = $e->getMessage();
}

$result = [
    'error' => $error,
    'message' => $message,
];

print json_encode($result, JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);