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
		callback(domains ? domains[0] : undefined)
	})
}

prog
	.version('1.0.0')
	.command('start', 'Start a web server')
	.argument('[path]', 'Shared folder relative path', null, '.')
	.action(function (args, options, logger) {
		let homeServer = new server.homeServer(args.path)
		homeServer.start()
	})
	.command('scan', 'Find all running web servers on network')
	.action(function (args, options, logger) {
		logger.info(colors.green('Found following devices:'))
		server.utils.scan(host => server.utils.reverseLookup(host, d => logger.info(`${colors.green(d)}: http://${host}:8080`)))
	})

prog.parse(process.argv)