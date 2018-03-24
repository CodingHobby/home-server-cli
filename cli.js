#!/usr/bin/env node
const prog = require('caporal'),
	server = require('home-file-server'),
	net = require('net'),
	{ address } = require('ip'),
	dns = require('dns'),
	colors = require('colors')

function reverseLookup(ip, callback) {
	let domain
	dns.reverse(ip, function (err, domains) {
		callback(domains[0])
	})
}

prog
	.version('1.0.0')
	.command('start', 'Start a web server')
	.argument('[path]', 'Shared folder relative path', null, '.')
	.action(function (args, options, logger) {
		let homeServer = new server(args.path)
		homeServer.start()
	})
	.command('scan', 'Find all running web servers on network')
	.action(function (args, options, logger) {
		logger.info(colors.green('Found following devices:'))
		for (let ip = 1; ip < 254; ip++) {
			let host = `${address().split('.').slice(0, 3).join('.')}.${ip}`
			let s = new net.Socket()
			s.setTimeout(2000, () => s.destroy())
			s.connect(8080, host, () => reverseLookup(host, d => logger.info(`${colors.green(d)}: http://${host}:8080`)))
			s.on('error', function (e) {
				s.destroy()
			})
		}
	})


prog.parse(process.argv)