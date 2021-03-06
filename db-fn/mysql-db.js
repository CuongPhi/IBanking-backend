var mysql = require('mysql');
var db_config  = require('../config/db_info');

class DB {
    constructor (){
        this.cn =  mysql.createConnection(db_config);
    }
    load(sql){
        return new Promise((resolve, reject) => {
           // this.cn.connect();
            this.cn.query(sql, (err, rows, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }    
               // this.cn.end();
            });
        });
    }
    insert(sql) {
        return new Promise((resolve, reject) => {
           // this.cn.connect();
            this.cn.query(sql, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
    
             //   this.cn.end();
            });
        });
    }
    getOne(sql) {
        return new Promise((resolve, reject) => {
           // this.cn.connect();
            this.cn.query(sql, (err, rows, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if(rows.length == 1) {
                        resolve(rows[0])
                    } else {
                        resolve(null);
                    }
                    
                }    
               // this.cn.end();
            });
        });
    }
}

module.exports = new DB();