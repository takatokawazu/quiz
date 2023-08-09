// 解答の選択肢一覧を取得
const answersList = document.querySelectorAll('ol.answers li');
// クリックされたときの処理を仕込む
answersList.forEach((li) => li.addEventListener('click', checkClickedAnswer));
console.log(answersList);
// 正しい答え(固定値なのでconstで定義)

function checkClickedAnswer(event) {
  // addEventListenerによって反応した要素(この実装ではli要素)
  const clickedAnswerElement = event.currentTarget;
  // 選択した答え(A,B,C,D)
  const selectedAnswer = clickedAnswerElement.dataset.answer;

  // 親要素のolから、data-idの値を取得
  const questionId = clickedAnswerElement.closest('ol.answers').dataset.id;
  // フォームデータの入れ物を作る
  const formData = new FormData();

  // 送信したい値を追加
  formData.append('id', questionId);
  formData.append('selectedAnswer', selectedAnswer);

  // xhr = XMLHttpRequestの頭文字です
  const xhr = new XMLHttpRequest();

  // HTTPメソッドをPOSTに指定、送信するURLを指定
  xhr.open('POST', 'answer.php');

  // フォームデータを送信
  xhr.send(formData);

  // loadendはリクエストが完了したときにイベントが発生する
  xhr.addEventListener('loadend', function (event) {
    // @type {XMLHttprequest}
    const xhr = event.currentTarget;

    // リクエスト成功かstatus
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      const result = response.result;
      const correctAnswer = response.correctAnswer;
      const correctAnswerValue = response.correctAnswerValue;
      const explanation = response.explanation;
      displayResult(result, correctAnswer, correctAnswerValue, explanation);
    } else {
      alert('Error; 回答のデータ取得に失敗しました。');
    }
  });
}

function displayResult(result, correctAnswer, correctAnswerValue, explanation) {
  // メッセージを入れる変数を用意
  let message;
  // カラーコードを入れる変数を用意
  let answerColorCode;

  // 答えが正しいか判定
  if (result) {
    // 正しい答えだったとき
    message = '正解です！おめでとう！';
    answerColorCode = '';
  } else {
    // 間違えた答えだったとき
    message = 'ざんねん！不正解です！';
    answerColorCode = '#f05959';
  }

  // アラートで正解・不正解を出力
  alert(message);

  // 正解の内容をHTMLに
  document.querySelector('span#correct-answer').innerHTML =
    correctAnswer + '. ' + correctAnswerValue;
  document.querySelector('span#explanation').innerHTML = explanation;
  // 色を変更(間違っていたときだけ色が変わる)
  document.querySelector('span#correct-answer').style.color = answerColorCode;
  // 答え全体を表示
  document.querySelector('div#section-correct-answer').style.display = 'block';
}
