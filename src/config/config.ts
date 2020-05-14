export const config = {
    'envType':typeof process.env.ENVIRONMENT_TYPE==='undefined'?
      'standAlone':
      process.env.ENVIRONMENT_TYPE,
    'dev': {
      'username': process.env.POSTGRESS_USERNAME,
      'password': process.env.POSTGRESS_PASSWORD,
      'database': process.env.POSTGRESS_DB,
      'host': process.env.POSTGRESS_HOST,
      'dialect': 'postgres',
      'aws_reigion': process.env.AWS_REGION,
      'aws_profile': process.env.AWS_PROFILE,
      'aws_media_bucket': process.env.AWS_BUCKET,
      'url': process.env.URL,
      'cliffLocation': 'http://localhost:8080'
    },
    'prod': {
      'username': '',
      'password': '',
      'database': 'udagram_prod',
      'host': '',
      'dialect': 'postgres',
      'cliffLocation': 'cliff'
    },
    'jwt': {
      'secret': process.env.JWT_SECRET
    },
    'standAlone':{
      'cliffLocation': 'localhost:8080'
    },
    'dockerCompose':{
      'cliffLocation': 'cliff:8080'
    },
    'kubernetes':{
      'cliffLocation': 'cliff:8080'
    }
  }