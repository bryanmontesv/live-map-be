const config = require('../../../config')
const path = require('path')
const dbPath = path.resolve(__dirname, `../${config.database.path}`)
const sqlite3 = require('sqlite3').verbose()
var db

/**
 * This function will create a new database with the second parameter sqlite3.OPEN_CREATE in case it doesn't exist
 */
const createDatabase = () => {
  db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      return console.error(err.message)
    }
    createTables()
    console.log('Connected to the in-memory SQlite database.')
  })
}

/**
 * This function will create locations table if it doesn't exist
 */
const createTables = () => {
  db.run(`CREATE TABLE IF NOT EXISTS locations ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    longitude TEXT NOT NULL,
    latitude TEXT NOT NULL,
    location_name TEXT,
    open_time INTEGER,
    close_time INTEGER,
    updated_at DATETIME NOT NULL DEFAULT current_timestamp,
    created_at DATETIME NOT NULL DEFAULT current_timestamp
  )`, (err) => {
    if (err) {
      console.error(err.message)
    }
    checkLocationsInformation()
    console.log('locations table created')
  })
}

/**
 * I need this function to know if the insertions were already execute, so I don't insert them again
 */
const checkLocationsInformation = () => {
  const queryStatement = `SELECT * FROM locations WHERE location_name in ('Allius', 'Gran Plaza', 'Unosquare', 'Gonzalitos')`
  db.all(queryStatement, [], (err, rows) => {
    if (err) {
      console.error(err.message)
    }
    if (rows.length > 0) {
      db.close()
    } else {
      storeLocationInformation()
    }
  })
}

/**
 * This function will store information on the locations table, the frontend should see them
 */
const storeLocationInformation = () => {
  const insertValuesArray = [
    ['-103.37294664147996', '20.66712812846032', 'Skycatch', '2018-08-26 09:00:00', '2018-08-26 19:00:00'],
    ['-103.3453', '20.6554', 'Unosquare', '2018-08-26 16:00:00', '2018-08-26 02:00:00'],
    ['-103.3533', '20.6534', 'Gran Plaza', '2018-08-26 12:00:00', '2018-08-26 23:00:00'],
    ['-103.3723', '20.6524', 'Gonzalitos', '2018-08-26 13:00:00', '2018-08-26 01:00:00']
  ]

  var location = db.prepare('INSERT INTO locations(longitude, latitude, location_name, open_time, close_time) VALUES (?,?,?,?,?)')

  insertValuesArray.forEach(element => {
    location.run(element)
  })

  location.finalize((err) => {
    if (err) {
      return console.error(err.message)
    }
    closeDatabaseConnection()
    console.log('Insert successful')
  })
}

const closeDatabaseConnection = () => {
  console.log('Closing database connection')
  db.close()
}

createDatabase()
