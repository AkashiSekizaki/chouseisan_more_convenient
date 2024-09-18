document.addEventListener("DOMContentLoaded", function () {
  function addTime() {
    const newTime = document.getElementById("newTime").value.trim();
    if (newTime) {
      const container = document.getElementById("timeOptions");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = newTime;
      checkbox.checked = true;
      const label = document.createElement("label");
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(newTime));
      container.appendChild(label);
      document.getElementById("newTime").value = "";
    } else {
      alert("時間の入力は空にできません。");
    }
  }

  window.addTime = addTime;

  function generateDateList() {
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const dateListElement = document.getElementById("dateList");
    const times = [];
    document
      .querySelectorAll('#timeOptions input[type="checkbox"]:checked')
      .forEach((box) => times.push(box.value));

    dateListElement.textContent = "";

    if (startDate && endDate && startDate <= endDate) {
      if (times.length > 0) {
        let dateText = "";
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dateStr = formatDate(d);
          times.forEach((time) => {
            dateText += `${dateStr} ${time}\n`;
          });
        }
        dateListElement.textContent = dateText;
        document.getElementById("copyButton").style.display = "inline";
      } else {
        alert("時間が選択されていません");
      }
    } else {
      alert("日付が正しく入力されていません");
    }
  }

  window.generateDateList = generateDateList;

  /* 'document.execCommand' は非推奨ですが、http環境で動くようにするにはい方がない... */
  /* 本来はnavigator.clipboardにしたかったが、SSL認証してない（httpsじゃない）環境へのアップロードを想定しているので今回はこうしました */
  document.getElementById("copyButton").addEventListener("click", function () {
    const textToCopy = document.getElementById("dateList").textContent;
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      const msg = successful ? "成功" : "失敗";
      alert("コピー" + msg + ": \n" + textToCopy);
    } catch (err) {
      console.error("クリップボードコピーに失敗しました", err);
      prompt("以下のテキストをコピーしてください:", textToCopy);
    }
    document.body.removeChild(textArea);
  });

  function formatDate(date) {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const day = days[date.getDay()];
    return `${date.getMonth() + 1}/${date.getDate()}(${day})`;
  }

  /*https環境なら以下*/
  /*
  document.getElementById("copyButton").addEventListener("click", function () {
    const textToCopy = document.getElementById("dateList").textContent;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("コピーされました: \n" + textToCopy);
        })
        .catch((err) => {
          console.error("クリップボードへのアクセスが拒否されました: ", err);
          // 代替方法でユーザーにテキストを手動でコピーするよう促す
          prompt("以下のテキストをコピーしてください:", textToCopy);
        });
    } else {
      // クリップボードAPIが利用不可能な場合のフォールバック
      prompt("以下のテキストをコピーしてください:", textToCopy);
    }
 */
});
