////////////////////////////////
//  GLOBAL SINGLETON VARIABLES
////////////////////////////////
const downloadDiv = document.getElementById("download-div");
const preloader = document.getElementById("preloader");
const lineSplitCount = document.getElementById("line-slice-count");
const fileInput = document.getElementById("file-input");

let lines = undefined;
let fileName = undefined;
let header = undefined;
let sliceCount = undefined;
let newData = undefined;

////////////////////////////////
//          FUNCTIONS
////////////////////////////////

const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

function handleContent(contents) {
  lines = contents.split("\n");
  [header] = lines;
  lines.shift();
  if (lines[lines.length - 1] == "") {
    lines.pop();
  }

  // SOME JOB HERE
  newData = [header, ...everyNth(lines, sliceCount)];

  hidePreloader();
  showDownloadStuff();
}

function mainHandler() {
  const file = fileInput.files[0];

  if (!sliceCount || sliceCount <= 0) {
    alert("Введенное число строк некорректно");
    return;
  }
  if (!file) {
    alert("Файл не выбран");
    return;
  }

  hideDownloadStuff();
  showPreloader();
  fileName = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target.result;
    handleContent(contents);
  };
  reader.readAsText(file);
}

function saveFile(filename, data) {
  const blob = new Blob([data], { type: "text/csv" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

function downloadHandler() {
  const [fileNameWithoutExt] = fileName.split(".");
  const CsvFile = fileNameWithoutExt + ".csv";
  saveFile(CsvFile, newData.join("\n"));
}

function showDownloadStuff() {
  downloadDiv.style.visibility = "visible";
}

function hideDownloadStuff() {
  downloadDiv.style.visibility = "hidden";
}

function showPreloader() {
  preloader.style.display = "block";
}

function hidePreloader() {
  preloader.style.display = "none";
}

/////////////////////////
//        MAIN
/////////////////////////

lineSplitCount.addEventListener("change", (e) => {
  sliceCount = Number(e.target.value);
  console.log(sliceCount);
});

hideDownloadStuff();
hidePreloader();
