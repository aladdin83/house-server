'use strict';

import express from 'express';

var router = express.Router();

router.get('/', (req, res)=>{
  res.status(200).end('House ERP API V1')
})


module.exports = router;