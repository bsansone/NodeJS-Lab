(function ($) {
    //console.log('js loaded....');
    var db;

    var openRequest = indexedDB.open("notelist", 1);
    openRequest.onupgradeneeded = function (e) {
        console.log("Upgrading DB...");
        var thisDB = e.target.result;
        if (!thisDB.objectStoreNames.contains("noteliststore")) {
            thisDB.createObjectStore("noteliststore", {
                autoIncrement: true
            });
        }
    }
    openRequest.onsuccess = function (e) {
        console.log("Open Success!");
        db = e.target.result;
        document.getElementById('add-btn').addEventListener('click', function () {
            var name = document.getElementById('name-in').value;
            var subject = document.getElementById('subject-in').value;
            var message = document.getElementById('message-in').value;
            if (!name.trim()) {
                //empty
            } else {
                addWord(name, subject, message, Date);
            }
        });
        renderList();
    }
    openRequest.onerror = function (e) {
        console.log("Open Error!");
        console.dir(e);
    }

    function addWord(n, s, m, date) {
        var transaction = db.transaction(["noteliststore"], "readwrite");
        var store = transaction.objectStore("noteliststore");
        var request = store.add({
            name: n,
            subject: s,
            message: m,
            date: new Date().toLocaleString()
        });
        request.onerror = function (e) {
            console.log("Error", e.target.error.name);
            //some type of error handler
        }
        request.onsuccess = function (e) {
            renderList();
            document.getElementById('name-in').value = '';
            document.getElementById('subject-in').value = '';
            document.getElementById('message-in').value = '';
        }
    }


    function renderList() {
        $('#list-wrapper').empty();
        $('#list-wrapper').html('<table class = "table table-bordered table-hover"><thead><tr><th>ID</th><th>Name</th><th>Subject</th><th>Message</th><th>Date/Time</th><th>Detail View</th></tr></thead></table>');

        //Count Objects
        var transaction = db.transaction(['noteliststore'], 'readonly');
        var store = transaction.objectStore('noteliststore');
        var countRequest = store.count();
        countRequest.onsuccess = function () {
            console.log(countRequest.result)
        };

        // Get all Objects
        var objectStore = db.transaction("noteliststore").objectStore("noteliststore");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var $link = $('<p data-key="' + cursor.key + '">' + cursor.value.name + '</p>');
                var $link2 = $('<p data-key="' + cursor.key + '">' + cursor.value.subject + '</p>');
                var $link3 = $('<p data-key="' + cursor.key + '">' + cursor.value.message + '</p>');
                var $link4 = $('<p data-key="' + cursor.key + '">' + cursor.value.date + '</p>');
                var $link5 = $('<a href="#" class="btn btn-default btn-xs"  role="button" data-key="' + cursor.key + '">+' + '</a>');
                $link5.click(function () {
                    //alert('Clicked ' + $(this).attr('data-key'));
                    loadTextByKey(parseInt($(this).attr('data-key')));
                });
                var $row = $('<tr >');
                var $keyCell = $('<td>' + cursor.key + '</td>');
                var $nameCell = $('<td></td>').append($link);
                var $subjectCell = $('<td></td>').append($link2);
                var $messageCell = $('<td></td>').append($link3);
                var $dateCell = $('<td></td>').append($link4);
                var $detailCell = $('<td></td>').append($link5);
                $row.append($keyCell);
                $row.append($nameCell);
                $row.append($subjectCell);
                $row.append($messageCell);
                $row.append($dateCell);
                $row.append($detailCell);
                $('#list-wrapper table').append($row);
                cursor.continue();
            } else {
                //no more entries
            }
        };
    }

    function loadTextByKey(key) {
        var transaction = db.transaction(['noteliststore'], 'readonly');
        var store = transaction.objectStore('noteliststore');
        var request = store.get(key);
        request.onerror = function (event) {
            // Handle errors!
        };
        request.onsuccess = function (event) {
            // Do something with the request.result!
            $('#detail').html('<h2>' + request.result.name + '</h2><h3>' + request.result.subject + '</h3><footer><i>' + request.result.date + '</i></footer><br><p>' + request.result.message + '</p><br>').toggle();
            var $delBtn = $('<button class="btn btn-danger btn-xs">Delete Entry</button>');
            $delBtn.click(function () {
                console.log('Delete ' + key);
                deleteWord(key);
            });
            $('#detail').append($delBtn);
        };
    }

    function deleteWord(key) {
        var transaction = db.transaction(['noteliststore'], 'readwrite');
        var store = transaction.objectStore('noteliststore');
        var request = store.delete(key);
        request.onsuccess = function (evt) {
            renderList();
            $('#detail').empty();
        };
    }






})(jQuery);