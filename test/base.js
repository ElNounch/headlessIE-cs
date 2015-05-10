var test = require('tape')
var express = require('express')
var fs = require('fs')
child_process = require('child_process')

function createRandomLocalAddress() {
    function upTo( max ) {
        return Math.floor( Math.random() * (max + 1) )
    }
    return '127.' + upTo(255) + '.' + upTo(255) + '.' + (upTo(252) + 2)
}
/*
test('return values test', function (t) {
    t.plan(2)

    t.test('version', function(tV) {
        tV.plan(1)
        headlessIE.version( function(err,reported_version) {
            if( err ) {
                tV.fail( 'problem while looking for version : ' + err )
            } else {
                tV.ok( typeof reported_version === 'string', 'version returned a string : "' + reported_version + '"' )
            }
        })
    })

    t.test('command', function(tC) {
        headlessIE.command( function( err, reported_cmd ) {
            if( err ) {
                tC.fail( 'problem while looking for path : ' + err )
                tC.end()
            } else {
                fs.stat( reported_cmd, function( err, stat ) {
                    tC.ok( stat, 'path exist...' )
                    tC.ok( stat.isFile(), '... and is a file' )
                    tC.end()
                })
            }
        })
    })
})
*/
test('functionnal test', { timeout: 30000 }, function (t) {
    var app = express()
    var server
    var proc
    var timer
    var job_done = false
    var local_addr = createRandomLocalAddress()

    app.get('/entrance', function (req, res) {
        res.setHeader( 'Connection', 'close' )
        res.setHeader( 'Content-Type', 'text/html' )
        res.send( '<html><head><script>location.href="/javascript_passed"</script><body></body></html>' )
        res.end()
        t.pass( 'entrance page accessed' )
    })
    app.get('/javascript_passed', function (req, res) {
        res.setHeader( 'Connection', 'close' )
        res.setHeader( 'Content-Type', 'text/plain' )
        res.send( 'Job done !' )
        res.end()
        t.pass( 'javascript worked' )
        job_done = true
        clearTimeout( timer )
        proc.kill()//'SIGHUP')
        server.close()
    })

    server = app.listen(8000, local_addr)

    timer = setTimeout( function onTimeOut() {
        proc.kill('SIGHUP')
        server.close()
    }, 25000)

    proc = child_process.spawn( 'bin/headlessIE.exe', [ 'http://' + local_addr + ':8000/entrance' ] )

    proc.stdout.on( 'data', function onStdout( data ) {
        t.comment( 'console message : ' + data )
    })

    proc.stderr.on( 'data', function onStderr( data ) {
        t.comment( 'error message : ' + data )
    })

    proc.on('exit', function onIEExit( code, signal ) {
        if( job_done ) {
            t.ok( code === null, 'exit code is correct' )
            t.ok( signal === 'SIGTERM', 'killed by signal' )
        } else {
            t.fail( 'unexpected browser quit' )
        }
        t.end()
    })
})
