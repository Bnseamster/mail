# mail
An email client that makes API calls to send and receive emails on the local server.

## Features
-**Send Mail:** JavaScript is used to send emails on the local server. AJAX requests are utilized to send information back and forth without reloading the page.

-**Mailbox:** When a user visits their Inbox, Sent mailbox, or Archive, the appropriate mailbox is loaded through javascript.
When a mailbox is visited, the application  queries the API for the latest emails in that mailbox.
Each email is rendered in its own box that displays who the email is from, what the subject line is, and the timestamp of the email.
If the email is unread, it appears with a white background otherwise its gray.

-**View Email:** When a user clicks on an email, the user is taken to a view where they see the content of that email.
Your application shows the email’s sender, recipients, subject, timestamp, and body.
Once the email has been clicked on, you should mark the email as read.

-**Archive and Unarchive:** The app allows users to archive and unarchive emails that they have received.
When viewing an Inbox email, the user is presented with a button that lets them archive the email. When viewing an email in Archive, the user can unarchive the email. 
Once an email has been archived or unarchived, load the user’s inbox.

-**Reply:** Reply to an email.
When viewing an email, the user is presented with a “Reply” button that lets them reply to the email.
When the user clicks the “Reply” button, they are taken to the email composition form.
The composition form is prefilled with the recipient field set to whoever sent the original email.

