const PARTICLES_AMOUNT = 50;
const SCREEN_PADDING = 25;
const PARTICLE_SPAN_DECLINE = 3;

const FIREWORK_GRAVITY = new Vector2(0, 0.25);
const PARTICLE_GRAVITY = new Vector2(0, 0.1);

class Firework extends Particle {
    constructor() {
        super(
            createVector(Random.range(SCREEN_PADDING, CanvasWidth - SCREEN_PADDING), CanvasHeight),
            Random.range(3, 4),
            new Vector2(0, Random.range(-10, -15)),
            //Rgb.random(255, 255, 255),
            color(207, 181, 59)
        );
        this.particles = [];
        this.exploded = false;
        this.firework = this;
        this.span = 255;
    }
    update() {
        if (!this.exploded) {
            super.addForce(FIREWORK_GRAVITY);
            super.update();
            super.draw();
            if (this.vel.y > 0 || this.pos.y < CanvasHeight / 4) {
                this.explode();
            }
        } else {
            this.span -= PARTICLE_SPAN_DECLINE;
            for (var particle of this.particles) {
                particle.addForce(PARTICLE_GRAVITY);
                particle.update();
                particle.draw();
            }
        }
    }
    done() {
        return this.span <= 0;
    }
    explode() {
        this.exploded = true;
        for (var i = 0; i < PARTICLES_AMOUNT; i++) {
            this.particles.push(
                new Particle(
                    this.pos.copy(),
                    Random.range(2, 3),
                    Vector.AngleToVector(Random.rangeInt(360), Random.range(3, 7)),
                    color(this.col),
                    this.firework
                )
            );
        }
    }
}