const mailer = require('nodemailer')


const maileSender = (sendTo, mailMessege, mailSubject='A Mail from D\'rental')=>{

    const user = 'felixongom2018@gmail.com'
    const password = 'dlfznpzyyqxmgfrr'
    const transporter = mailer.createTransport({
    service:'gmail',
    auth:{
        user,
        pass:password
    }
})

let mailOption ={
    from:user,
    to:sendTo,
    subject:mailSubject,
    text: mailMessege
    
}
transporter.sendMail(mailOption, (error, info)=>{
    if(error) return console.log(error);
    
    console.log('email sent');
})
}

module.exports ={maileSender}
