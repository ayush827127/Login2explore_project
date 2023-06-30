$("#rollNo").focus();

var connToken = '90933067|-31949324257483029|90951573';
var stDatabase = 'STUDENT';
var stRelation = 'STUDENT-REL';
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = '/api/irl';

function validatedata() {
    // Get form values
    var rollNo = $("#rollNo").val();
    var fullName = $("#fullName").val();
    var className = $("#class").val();
    var birthDate = $("#birthDate").val();
    var address = $("#address").val();
    var enrollmentDate = $("#enrollmentDate").val();

    if (rollNo == '') {
        alert("Roll-no is missing");
        $("#rollNo").focus();
        return "";
    }
    if (fullName == '') {
        alert("fullName is missing");
        $("#fullName").focus();
        return "";
    }
    if (className == '') {
        alert("className is missing");
        $("#class").focus();
        return "";
    }
    if (birthDate == '') {
        alert("birthDate is missing");
        $("#birthDate").focus();
        return "";
    }
    if (address == '') {
        alert("address is missing");
        $("#address").focus();
        return "";
    }
    if (enrollmentDate == '') {
        alert("enrollmentDate is missing");
        $("#enrollmentDate").focus();
        return "";
    }
    var jsonstrobj = {
        roll: rollNo,
        name: fullName,
        class: className,
        dob: birthDate,
        add: address,
        eod: enrollmentDate
    };
    return JSON.stringify(jsonstrobj);
}

function savedata() {
    var jsonstrobj = validatedata();
    if (jsonstrobj == "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonstrobj, stDatabase, stRelation);
    jQuery.ajaxSetup({ async: false });
    var resjsonobj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseUrl , jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetform();
    $("#rollNo").focus();
}



function resetform() {
    // Reset form fields
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");
    $("#rollNo").prop('disabled', false);
    $("#submitBtn").prop('disabled', true);
    $("#updateBtn").prop('disabled', true);
    $("#resetBtn").prop('disabled', true);
    $("#rollNo").focus();
}

function updatedata() {
    $("#updateBtn").prop('disabled', true);
    var jsonChange = validatedata();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChange, stDatabase, stRelation, localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resjsonobj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({ async: false });
    resetform();
    $("#rollNo").focus();
}

function getstdasJsonobj() {
    var rollNo = $("#rollNo").val();
    var jsonstrobj = {
        roll: rollNo
    };
    return JSON.stringify(jsonstrobj);
}

function getstd() {
    var stdjsonobj = getstdasJsonobj();
    var getRequest = createGET_BY_KEYRequest(connToken, stDatabase, stRelation, stdjsonobj);
    jQuery.ajaxSetup({ async: false });
    var resjsonobj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resjsonobj.status == 400) {
        $("#submitBtn").prop('disabled', false);
        $("#resetBtn").prop('disabled', false);
        $("#fullName").focus();
    }  else if (resjsonobj.status == 200) {
        $("#rollNo").prop('disabled', true);
        fillData(resjsonobj);

        $("#updateBtn").prop('disabled', false);
        $("#resetBtn").prop('disabled', false);
        $("#fullName").focus();
    }
}

function fillData(jsonObj) {
    saveRecNo2Ls(jsonObj);
    var record = JSON.parse(jsonObj.data).record;

    $("#fullName").val(record.name);
    $("#class").val(record.class);
    $("#birthDate").val(record.dob);
    $("#address").val(record.add);
    $("#enrollmentDate").val(record.eod);
}
function saveRecNo2Ls(jsonObj) {
    var lvdata = JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvdata.rec_no);
}