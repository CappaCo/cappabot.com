// deno-lint-ignore-file no-unused-vars no-var

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

function test() {
    var engine = Engine.create(),
        world = engine.world;
    
    var render = Render.create({
        element: testContainer,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false
        }
    });

    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engine);
}

function mixedShapes() {
    // create engine
    var engine = Engine.create(),
        world = engine.world;
    
    // create renderer
    var render = Render.create({
        element: testContainer,
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: true,
        }
    });
    
    Render.run(render);
    
    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);
    
    // add bodies
    var stack = Composites.stack(width/4, 20, 10, 5, 0, 0, function(x, y) {
        var sides = Math.round(Common.random(1, 8));
    
        // round the edges of some bodies
        var chamfer = null;
        if (sides > 2 && Common.random() > 0.7) {
            chamfer = {
                radius: 10
            };
        }
    
        switch (Math.round(Common.random(0, 1))) {
        case 0:
            if (Common.random() < 0.8) {
                return Bodies.rectangle(x, y, Common.random(width/24, width/16), Common.random(height/24, height/16), { chamfer: chamfer });
            } else {
                return Bodies.rectangle(x, y, Common.random(width/10, width/8), Common.random(height/24, height/20), { chamfer: chamfer });
            }
        case 1:
            return Bodies.polygon(x, y, sides, Common.random(width/24, width/16), { chamfer: chamfer });
        }
    });
    
    Composite.add(world, stack);
    
    Composite.add(world, [
        Bodies.rectangle(width/2, 0, width, 50, { isStatic: true }), // top
        Bodies.rectangle(width, height/2, 50, height, { isStatic: true }), // right
        Bodies.rectangle(width/2, height, width, 50, { isStatic: true }), // bottom
        Bodies.rectangle(0, height/2, 50, height, { isStatic: true }) // left
    ]);
    
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
    
    Composite.add(world, mouseConstraint);
    
    // keep the mouse in sync with rendering
    render.mouse = mouse;
    
    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });
}

function cubeStack() {
    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: testContainer,
        engine: engine,
        options: {
            width: width,
            height: height
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // scene code
    var stack = Composites.stack(width/4, height - 25 - (20*width/2/25), 25, 20, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, width/2/25, width/2/25);
    });
    
    Composite.add(world, [
        stack,
        Bodies.rectangle(width/2, 0, width, 50, { isStatic: true }), // top
        Bodies.rectangle(width, height/2, 50, height, { isStatic: true }), // right
        Bodies.rectangle(width/2, height, width, 50, { isStatic: true }), // bottom
        Bodies.rectangle(0, height/2, 50, height, { isStatic: true }) // left
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });
}

function soft() {
    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: testContainer,
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: false
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var particleOptions = { 
        friction: 0.05,
        frictionStatic: 0.1,
        render: { visible: true } 
    };

    const softSomething = function (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
        var Common = Matter.Common,
            Composites = Matter.Composites,
            Bodies = Matter.Bodies;
    
        particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
        constraintOptions = Common.extend({ stiffness: 0.2, render: { type: 'line', anchors: false } }, constraintOptions);
    
        var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
            return Bodies.circle(x, y, particleRadius, particleOptions);
        });
    
        Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
    
        softBody.label = 'Soft Body';
    
        return softBody;
    }

    Composite.add(world, [
        softSomething(width/4, height/6, 5, 5, 0, 0, true, width/50, particleOptions),
        softSomething(width/2, height/4, 9, 3, 0, 0, true, width/64, particleOptions),
        softSomething(width/1.5, height/2, 4, 4, 0, 0, true, width/64, particleOptions),
        // walls
        Bodies.rectangle(width/2, 0, width, 50, { isStatic: true }), // top
        Bodies.rectangle(width, height/2, 50, height, { isStatic: true }), // right
        Bodies.rectangle(width/2, height, width, 50, { isStatic: true }), // bottom
        Bodies.rectangle(0, height/2, 50, height, { isStatic: true }) // left
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.9,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });
}

function cradle() {
    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: testContainer,
        engine: engine,
        options: {
            width: width,
            height: height
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    const cradleSomething = function(xx, yy, number, size, length) {
        var Composite = Matter.Composite,
            Constraint = Matter.Constraint,
            Bodies = Matter.Bodies,
            separation;
    
        var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });

        separation = 0.95
        for (let i = 0.5; i < number + 0.5; i++) {
            circle = Bodies.circle(xx + ((i - number/2) * size), yy + length, size/2, 
                { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0, slop: size * 0.02 });

            constraint = Constraint.create({ pointA: { x: xx + ((i - number/2) * size * separation), y: yy }, bodyB: circle });
    
            Composite.addBody(newtonsCradle, circle);
            Composite.addConstraint(newtonsCradle, constraint);
        }
    
        return newtonsCradle;
    };

    // see newtonsCradle function defined later in this file
    var cradle = cradleSomething(width/2, height/3, 5, width/3/5, height/3);
    Composite.add(world, cradle);
    //Body.translate(cradle.bodies[0], { x: -180, y: -100 });

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 50 },
        max: { x: width, y: height }
    });
}

function doublePendulum() {
    var engine = Engine.create(),
        world = engine.world;
    
    var render = Render.create({
        element: testContainer,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: true
        }
    });

    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engine);

    const minLen = Math.min(width, height)/4;

    var
    circle1 = Bodies.circle(width/2, height/2 - minLen, minLen/5, { frictionAir: 0, friction: 0, frictionStatic: 0, intertia: Infinity}),
    circle2 = Bodies.circle(width/2 + minLen, height/2 - minLen, minLen/5, { frictionAir: 0, friction: 0, frictionStatic: 0, intertia: Infinity}),

    arm1 = Constraint.create({ pointA: {x: width/2, y: height/2}, bodyB: circle1}),
    arm2 = Constraint.create({ bodyA: circle1, bodyB: circle2});

    Composite.add(world, [circle1, circle2, arm1, arm2]);

    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);
}

function angerBird() {
    // create engine
    var engine = Engine.create(),
        world = engine.world;
    
    // create renderer
    var render = Render.create({
        element: testContainer,
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: true,
        }
    });
    
    Render.run(render);
    
    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

	// angry
	var plank = {
		height: height/5,
		width: width/50,
	}

	var slingshot = Bodies.rectangle(width/5, height - height/10 - 25, plank.width, plank.height, { isStatic: true, collisionFilter: { category: 69 } });

	Composite.add(world, slingshot);

	function makePlank(x, y, rotato) {
        let object;
		if (rotato) {
			object = Bodies.rectangle(x, y, plank.width, plank.height);
		} else {
			object = Bodies.rectangle(x, y, plank.height, plank.width);
		}

		Composite.add(world, object);
	}

	// bird
	var bird = Bodies.circle(width/5, height - height/10 - 25, width/30);
	Composite.add(world, bird);

	var sproingus = Constraint.create({ bodyA: bird, bodyB: slingshot, pointB: { x: 0, y: plank.width/2 - plank.height/2 }, stiffness: 0.2, length: 50 });
	Composite.add(world, sproingus);

	// bad piggie
	for (let i = 0; i < 3; i ++) {
		makePlank((plank.height) * i + width - width/3, height - height/10 - 25, true);
	}

	for (let i = 0; i < 2; i ++) {
		makePlank((plank.height) * i + width - width/3 + plank.height/2, height - plank.height - 25 - plank.width/2, false);
	}

	for (let i = 0; i < 2; i ++) {
		makePlank((plank.height) * i + width - width/3 + plank.height/2, height - height/10 - 25 - plank.height - plank.width, true);
	}

	makePlank(plank.height + width - width/3, height - plank.height*2 - 25 - plank.width*1.5, false);
    
    Composite.add(world, [
        Bodies.rectangle(width/2, 0, width, 50, { isStatic: true }), // top
        Bodies.rectangle(width, height/2, 50, height, { isStatic: true }), // right
        Bodies.rectangle(width/2, height, width, 50, { isStatic: true }), // bottom
        Bodies.rectangle(0, height/2, 50, height, { isStatic: true }) // left
    ]);
    
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.9,
                render: {
                    visible: false
                }
            }
        });
    
    Composite.add(world, mouseConstraint);
    
    // keep the mouse in sync with rendering
    render.mouse = mouse;
    
    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });
}
