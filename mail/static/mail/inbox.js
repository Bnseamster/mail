const email_template = `<div class="list-group" >
  <a name="view-email" style=background-color:{{color}} onclick="view_mail({{id}});return false;" value="{{id}}"class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{sender}}</h5>
      <small>{{date}}</small>
    </div>
    <p class="mb-1">{{subject}}</p>
    <small>{{read}}</small>
    
  </a>
  <button name = "archive" onclick="archive('archive',{{index}},{{id}},{{archived}});return false;" type="button" class="btn btn-info" >{{arcBtn}}</button>
  </div>`;

const view_email_template = `<div class="jumbotron">
  <h2 class="display-4">Subject:{{subject}}</h2>
  <div class="d-flex w-100 justify-content-between">
  <h5 class="mb-1">Sender: {{sender}}</h5>
  <h5 class="mb-1" id='recipients'></h5>
  <small>{{date}}</small>
  </div>
  <hr class="my-4">
  <p>{{body}}</p>
  <p class="lead">
    <a class="btn btn-primary btn-lg" onclick="return reply();return false;" role="button">Reply</a>
  </p>
  </div>
    
  </a>
  <button name = "archive" onclick="archive('archive',{{index}},{{id}},{{archived}});return false;" type="button" class="btn btn-info" >{{arcBtn}}</button>
  </div>`;

const reply_template = `<h3>Reply</h3>
<form id="newEmail" onsubmit="return submit_form()">
    <!--<div class="form-group">
        From: <input disabled class="form-control" value="{{ sender }}">
    </div>-->
    <div class="form-group">
        To: <input disabled id="reply-recipients" class="form-control" value="{{ sender }}">
    </div>
    <div class="form-group">
        <input class="form-control" id="reply-subject" value="Re: {{ subject }}">
    </div>
    <textarea class="form-control" id="reply-body" >On {{date}} {{sender}} wrote: {{body}}</textarea>
    <input type="submit" class="btn btn-primary"/>
</form>`


document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email(false));
  


  // By default, load the inbox
  load_mailbox('inbox');
});

 function submit_form() { 

    send_mail();
    

    return false;
  };
 
function compose_email(reply) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';
  if(!reply){
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }else{
    document.getElementById("compose-recipients").value = document.getElementById("reply-recipients").value 
    document.getElementById("compose-subject").value = document.getElementById("reply-subject").value 
    document.getElementById("compose-body").value= document.getElementById("reply-body").value 
  }

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';
  document.getElementById('reply-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // Get the emails for this mailbox
  
  fetch(`http://127.0.0.1:8000/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(function(e, index){
      
      let newContent = document.createElement("div");
      const templateFunction = Handlebars.compile(email_template);
      if (e.read){
        var read = 'Read'
        var color = 'grey'
      } else {
        var read = 'Unread'
        var color = 'white'
      }

      if (e.archived){
        var archived = 'Unarchive'
      } else {
        var archived = 'Archive'
      }
        
      newContent.innerHTML = templateFunction({ index: index, sender: e.sender , date: e.timestamp , subject: e.subject , read:read ,id: e.id, archived: e.archived, arcBtn: archived, color:color });;
      let email = document.getElementById('emails-view');
      email.appendChild(newContent);
    });


    
  });
}

function send_mail() {
  //sends mail through post request and then displays users "sent" mailbox
  fetch('http://127.0.0.1:8000/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.getElementById("compose-recipients").value,
        subject: document.getElementById("compose-subject").value,
        body: document.getElementById("compose-body").value
    })
  })
  .then(response =>{ 

    document.getElementById('email-sent-alert').style.display = 'block';
    load_mailbox('sent');
  });


}


function view_mail(id) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'block';
  document.getElementById('reply-view').style.display = 'none';
  
  //clears emails
  document.querySelector('#email').innerHTML = '';


  // Get the emails for this mailbox
  
  fetch(`http://127.0.0.1:8000/emails/${id}`)
  .then(response => response.json())
  .then(emails => {

      if (emails.read){
        var read = 'Read'
      } else {
        var read = 'Unread'
      }

      if (emails.archived){
        var archived = 'Unarchive'
      } else {
        var archived = 'Archive'
      }

      let newContent = document.createElement("div");
      const emailTemplateFunction = Handlebars.compile(view_email_template);

      newContent.innerHTML = emailTemplateFunction({ sender: emails.sender , date: emails.timestamp , subject: emails.subject , read: read ,id: emails.id, body: emails.body, archived: emails.archived, arcBtn: archived });;
      let email = document.querySelector('#email');      
      email.appendChild(newContent);
      let recipients = emails.recipients.join(', ')
      document.getElementById('recipients').innerHTML = `Recipients: ${recipients}`

      const replyTemplateFunction = Handlebars.compile(reply_template);
      let replyDraft = document.querySelector('#reply-view');
      replyDraft.innerHTML = replyTemplateFunction({ sender: emails.sender , date: emails.timestamp , subject: emails.subject , read: read ,id: emails.id, body: emails.body });;
            
      

  });

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  return false;
}

function archive(mailbox, index, id, archived) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  


  if (!archived){
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  } else {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  }


  fetch(`http://127.0.0.1:8000/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    if (emails.archived == false) {

      if (emails[index].read){
        var read = 'Read'
      } else {
        var read = 'Unread'
      }

      var archived = 'Archive'
    

      let newContent = document.createElement("div");
      const templateFunction = Handlebars.compile(email_template);
      newContent.innerHTML = templateFunction({ sender: emails[index].sender , date: emails[index].timestamp , subject: emails[index].subject , read: read ,id: emails[index].id });;
      let email = document.getElementById('archive-item');
      email.appendChild(newContent);
    };
    
  });
  return false;
    

}

function reply() {
  document.getElementById("compose-recipients").value = document.getElementById("reply-recipients").value 
  document.getElementById("compose-subject").value = document.getElementById("reply-subject").value 
  document.getElementById("compose-body").value= document.getElementById("reply-body").value 
  

  compose_email(true);


}


