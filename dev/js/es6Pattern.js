class es6class {
    constructor( text ) {
        console.log(`Running a ${text}`)
    }

    exec() 
    {
        console.log('Executing method exec')
    }
}

const es6Obj = new es6class('Babel Example')
es6Obj.exec()