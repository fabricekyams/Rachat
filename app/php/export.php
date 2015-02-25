<?php
ini_set('display_errors', 1);

require_once './PhpWord/Autoloader.php';
\PhpOffice\PhpWord\Autoloader::register();
$phpWord = new \PhpOffice\PhpWord\PhpWord();

$section = $phpWord->addSection();

$section->addText(
    htmlspecialchars(
        '"Learn from yesterday, live for today, hope for tomorrow. '
            . 'The important thing is not to stop questioning." '
            . '(Albert Einstein)'
    )
);

$section->addText(
    htmlspecialchars(
        '"Great achievement is usually born of great sacrifice, '
            . 'and is never the result of selfishness." '
            . '(Napoleon Hill)'
    ),
    array('name' => 'Tahoma', 'size' => 10, 'color' => '1B2232', 'bold' => true) //font and size
);
$fontStyleName = 'oneUserDefinedStyle'; 

$phpWord->addFontStyle(
    $fontStyleName,
    array('name' => 'Tahoma', 'size' => 10, 'color' => '1B2232', 'bold' => true)
);
$section->addText(
    htmlspecialchars(
        '"The greatest accomplishment is not in never falling, '
            . 'but in rising again after you fall." '
            . '(Vince Lombardi)'
    ),
    $fontStyleName
);

$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
$objWriter->save('helloWorld.docx');
