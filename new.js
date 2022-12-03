
function genEmail() {
    $.getJSON("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1", (res) => {
        $('#addr').val(res[0]);
        refreshMail();
    })
}

function refreshMail() {
    addr = $('#addr').val();
    if (!addr) {
        alert("Please generate or input an email address first!");
        return
    }

    user = addr.split('@')[0];
    domain = addr.split('@')[1];

    $.getJSON(`https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`, (emails) => {
        $('#emails').empty();

        $('#emails').append($(`
            <tr>
                 <th><b>ID</b></th>
                 <th><b>From</b></th>
                <th><b>Subject</b></th>
                 <th><b>Date</b></th>
                 <th><b>Content</b></th>
            </tr>
        `));

        for (i in emails) {
            email = emails[i];

            $('#emails').append($(`
                <tr>
                    <td>${email['id']}</td>
                    <td>${email['from']}</td>
                    <td>${email['subject']}</td>
                    <td>${email['date']}</td>
                    <td id="${email['id']}"><a onclick="loadEmail('${email['id']}')">Load content...</a></td>
                </tr>
            `))
        }
    })
}

function loadEmail(id) {
    addr = $('#addr').val();
    if (!addr) {
        alert("Please generate or input an email address first!");
        return
    }

    user = addr.split('@')[0];
    domain = addr.split('@')[1];

    $.getJSON(`https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=${domain}&id=${id}`, (email) => {
        elm = $(`#${id}`);
        if (email['htmlBody']) {
            elm.html(email['htmlBody']);
        } else {
            elm.text(email['body']);
        }

        atts = $('<div></div>');
        for (i in email['attachments']) {
            file = email['attachments'][i];

            atts.append($(`<a href='https://www.1secmail.com/api/v1/?action=download&login=${user}&domain=${domain}&id=${id}&file=${file['filename']}'>${file['filename']}</a>`));
        }
        elm.append(atts);
    })
}

$(function () {
    genEmail();
})

