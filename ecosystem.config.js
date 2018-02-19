module.exports = {
	apps: [{
		name: 'Conteca Network',
		script: './index.js'
	}],
	deploy: {
		production: {
			user: 'ubuntu',
			host: 'ec2-18-219-223-238.us-east-2.compute.amazonaws.com',
			key: '~/.ssh/contecanetwork.pem',
			ref: 'origin/master',
			repo: 'git@github.com:stefanoruschettacaleffi/contecanetwork.git',
			path: '/home/ubuntu/contecanetwork',
			'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
		}
	}
}
