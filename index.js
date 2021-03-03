const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'database',
  database : 'bankDB',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log(`connected as id ${connection.threadId}`);
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// const sql = `CREATE TABLE account (
// number INT PRIMARY KEY AUTO_INCREMENT,
// balance REAL,
// date TIMESTAMP,
// )`;

// const sql = `CREATE TABLE customer (
// id INT PRIMARY KEY AUTO_INCREMENT,
// firstname VARCHAR(64),
// lastname VARCHAR(64),
// birthdate VARCHAR(64),
// gender VARCHAR(64),
// mobile VARCHAR(64),
// email VARCHAR(128),
// addressline1 VARCHAR(128),
// addressline2 VARCHAR(128),
// landmark VARCHAR(128),
// district VARCHAR(128),
// city VARCHAR(128),
// state VARCHAR(128),
// password VARCHAR(64),
// number INT,
// date TIMESTAMP,
// FOREIGN KEY (number) REFERENCES account(number)
// )`;

// const sql = `CREATE TABLE transaction (
// txnid INT PRIMARY KEY AUTO_INCREMENT,
// number INT,
// amount REAL,
// type ENUM('debit', 'credit'),
// description VARCHAR(255),
// date TIMESTAMP,
// FOREIGN KEY (number) REFERENCES account(number)
// )`;

// const sql = `CREATE TABLE loan (
// loanid INT PRIMARY KEY AUTO_INCREMENT,
// number INT,
// amount REAL,
// emi REAL,
// category VARCHAR(255),
// installments INT,
// date TIMESTAMP,
// FOREIGN KEY (number) REFERENCES account(number)
// )`;

// const sql = `create event increment 
// on schedule every 2 minute 
// starts current_timestamp 
// ends current_timestamp + interval 24 hour 
// do 
//   update account set balance = balance * 1.01;`;

// const sql = `ALTER TABLE account AUTO_INCREMENT = 100`;

// connection.query(sql, function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is:\n', results);
//   console.log(fields);
// });

app.get('/', (req, res) => {
  // const sql = `SELECT * from account;SELECT * from customer`;
  // connection.query(sql, function(err, results) {
  //   if (err) throw err;

  //   // `results` is an array with one element for every statement in the query:
  //   console.log(results);
  //   console.log(results[0]); // [{1: 1}]
  //   console.log(results[1]); // [{2: 2}]
  // });
  res.render('home');
});

app.get('/account/new', (req, res) => {
  res.render('create');
});

app.get('/account/create', (req, res) => {
  res.render('signup');
});

app.get('/account/joint', (req, res) => {
  res.render('joint');
});

app.get('/account/login', (req, res) => {
  res.render('login');
});

app.get('/loans', (req, res) => {
 res.render('loan');
});

app.get('/account/:number', (req, res) => {
  // res.render('account');
  const sql = `SELECT * FROM account WHERE number=${req.params.number};SELECT * FROM transaction WHERE number=${req.params.number}`;
  connection.query(sql, (error, results, fields) => {
    // console.log(results[0][0], results[1][0]);
    const innersql = `SELECT * FROM customer WHERE number=${req.params.number}`;
    connection.query(innersql, (error, customer, fields) => {
      res.render('account', {details: results[0][0], txn: results[1], cust: customer[0]});
    });
  });
});

app.post('/api/account', (req, res) => {
  const {id, number, password} = req.body;
  const sql = `SELECT * FROM customer WHERE id=${id}`;
  connection.query(sql, (error, results, fields) => {
    if(error){ 
      res.send({error: error});
    }else{
      // console.log(results[0], results[0].id);
      if(results.length == 1 && results[0].number == number && results[0].password == password){
        console.log('yo');
        res.send({redirect: '/account/' + number});
      } else {
        res.send({error: 'invalid credentials'});
      }
    }
  });
});

app.post('/api/account/new', (req, res) => {
  console.log(req.body);

  const {firstname, lastname, birthdate, gender, mobile, email, addressline1, addressline2, landmark, district, city, state, password} = req.body;

  const innersql = `INSERT INTO account (balance) VALUES (0)`;
  connection.query(innersql, (error, results, fields) => {
    console.log(results, fields);
    const sql = `INSERT INTO customer 
    (firstname, lastname, birthdate, gender, mobile, email, addressline1, addressline2, landmark, district, city, state, password, number)
    VALUES ('${firstname}', '${lastname}', '${birthdate}', '${gender}', '${mobile}', '${email}', '${addressline1}', '${addressline2}', '${landmark}', '${district}', '${city}', '${state}', '${password}', '${results.insertId}')`;

    connection.query(sql, (error, customer, fields) => {
      if(error) throw error;
      // console.log(results, fields);
      res.send({redirect: '/account/' + results.insertId});
    });
  });

});

app.post('/api/account/newjoint', (req, res) => {
  console.log(req.body);

  const {firstname, lastname, birthdate, gender, mobile, email, addressline1, addressline2, landmark, district, city, state, password,
    firstname1, lastname1, birthdate1, gender1, mobile1, email1, addressline11, addressline21, landmark1, district1, city1, state1, password1} = req.body;

    const innersql = `INSERT INTO account (balance) VALUES (0)`;
    connection.query(innersql, (error, results, fields) => {
      console.log(results, fields);
      var sql = `INSERT INTO customer 
      (firstname, lastname, birthdate, gender, mobile, email, addressline1, addressline2, landmark, district, city, state, password, number)
      VALUES ('${firstname}', '${lastname}', '${birthdate}', '${gender}', '${mobile}', '${email}', '${addressline1}', '${addressline2}', '${landmark}', '${district}', '${city}', '${state}', '${password}', '${results.insertId}')`;

      connection.query(sql, (error, customer, fields) => {
        if(error) throw error;
        console.log(results, fields);
      });

      sql = `INSERT INTO customer 
      (firstname, lastname, birthdate, gender, mobile, email, addressline1, addressline2, landmark, district, city, state, password, number)
      VALUES ('${firstname1}', '${lastname1}', '${birthdate1}', '${gender1}', '${mobile1}', '${email1}', '${addressline11}', '${addressline21}', '${landmark1}', '${district1}', '${city1}', '${state1}', '${password1}', '${results.insertId}')`;

      connection.query(sql, (error, customer, fields) => {
        if(error) throw error;
        console.log(results, fields);
        res.send({redirect: '/account/' + results.insertId});
      });
    });

  });

app.post('/api/account/:number/debit', (req, res) => {
  const {sub} = req.body;
  const sql = `UPDATE account SET balance = balance - ${sub} WHERE number = ${req.params.number}`;
  const txnsql = `INSERT INTO transaction (number, amount, type) VALUES ('${req.params.number}', '${sub}', 'debit')`;

  connection.query(txnsql, (error, results, fields) => {
    if(error) throw error;
    console.log('debit',results);
  });

  connection.query(sql, (error, results, fields) => {
    console.log(results);
    res.redirect('back');
  });
});

app.post('/api/account/:number/credit', (req, res) => {
  console.log(req.body);
  const {add} = req.body;
  const sql = `UPDATE account SET balance = balance + ${add} WHERE number = ${req.params.number}`;
  const txnsql = `INSERT INTO transaction (number, amount, type) VALUES ('${req.params.number}', '${add}', 'credit')`;

  connection.query(txnsql, (error, results, fields) => {
    if(error) throw error;
    console.log('credit',results);
  });

  connection.query(sql, (error, results, fields) => {
    console.log(results);
    res.redirect('back');
  });
});

app.post('/api/account/:number/transfer', (req, res) => {
  const {number, amount} = req.body;

  const check = `SELECT * FROM account WHERE number=${number}`;

  connection.query(check, (error, results, fields) => {
    if(error){
      res.send({error: error});
    }else{
      if(results.length == 1){
        var sql = `UPDATE account SET balance = balance - ${amount} WHERE number = ${req.params.number}`;
        var txnsql = `INSERT INTO transaction (number, amount, type, description) VALUES ('${req.params.number}', '${amount}', 'debit', 'transfered to account number ${number}')`;

        connection.query(txnsql, (error, results, fields) => {
          if(error) throw error;
          console.log('debit',results);
        });

        connection.query(sql, (error, results, fields) => {
          console.log(results);
        });

        sql = `UPDATE account SET balance = balance + ${amount} WHERE number = ${number}`;
        txnsql = `INSERT INTO transaction (number, amount, type, description) VALUES ('${number}', '${amount}', 'credit', 'transfered from account number ${req.params.number}')`;

        connection.query(txnsql, (error, results, fields) => {
          if(error) throw error;
          console.log('credit',results);
        });

        connection.query(sql, (error, results, fields) => {
          console.log(results);
          res.redirect('back');
        });
      } else {
        res.send({error: 'wrong account number'});
      }
    }
  });

});

app.post('/api/loan', (req, res) => {
  const {id, number, password, amount, category, installments} = req.body;
  const emi = amount / installments;
  const sql = `SELECT * FROM customer WHERE id=${id}`;
  connection.query(sql, (error, results, fields) => {
    if(error){ 
      res.send({error: error});
    }else{
      if(results.length == 1 && results[0].number == number && results[0].password == password){
        console.log('yo');
        const loansql = `INSERT INTO loan (number, amount, emi, category, installments) VALUES ('${number}', '${amount}', '${emi}', '${category}', '${installments}')`;

        connection.query(loansql, (error, loan, fields) => {
          if(error) console.log('loan', error);
          const name = 'deduct' + loan.insertId;
            const eventsql = `CREATE EVENT ${name}
            ON SCHEDULE EVERY 1 MINUTE
            STARTS CURRENT_TIMESTAMP
            ENDS CURRENT_TIMESTAMP + INTERVAL 1 HOUR
            DO 
              BEGIN
                SET @in = 0;
                SELECT @in := installments FROM loan WHERE loanid=${loan.insertId};

                UPDATE account 
                SET balance = case
                                when @in > 0 then balance - ${emi}
                                else balance
                              end
                WHERE number = ${number};

                UPDATE loan 
                SET amount = case 
                                when @in > 0 then amount - ${emi}
                                else amount
                              end
                WHERE loanid = ${loan.insertId};
                
                UPDATE loan
                SET installments = case
                                    when @in > 0 then installments - 1
                                    else installments
                                  end
                WHERE loanid = ${loan.insertId};

                IF (@in > 0) THEN
                  INSERT INTO transaction (number, amount, type, description) VALUES ('${number}', '${emi}', 'debit', 'deducted by loan_id ${loan.insertId}');
                END IF;
              END`;

            connection.query(eventsql, (error, event, fields) => {
              if(error) console.log(error);
              console.log('no error event is on');
                res.send({success: `${category} loan (loan_id: ${loan.insertId}) has been successfully provided to account number ${number}`});
              
            });

        });

      } else {
        res.send({error: 'invalid credentials'});
      }
    }
  });
});

const port = 8000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});