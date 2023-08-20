class DoublePendulum {
    constructor(x, y, angle_a, len_a, m_a, angle_b, len_b, m_b) {
        this.ax = x;
        this.ay = y;

        this.ang_a = angle_a;
        this.ang_b = angle_b;
        //console.log(this.ang_b);

        this.vel_a = 0;
        this.vel_b = 0.3;

        this.len_a = len_a;
        this.len_b = len_b;

        this.mass_a = m_a;
        this.mass_b = m_b;

        this.gravity = new Vector2(0, 20);
        this.g = this.gravity.mag();
        this.down = this.gravity.heading();
    }
    num_a() {
        return -this.g * (2 * this.mass_a + this.mass_b) * sin(this.ang_a)
            - this.mass_b * this.g * sin(this.ang_a - 2 * this.ang_b)
            - 2 * sin(this.ang_a - this.ang_b) * this.mass_b
            * ((this.vel_b ** 2) * this.len_b + (this.vel_a ** 2) * this.len_a * cos(this.ang_a - this.ang_b));
    }
    num_b() {
        return 2 * sin(this.ang_a - this.ang_b) * (this.vel_a ** 2 * this.len_a * (this.mass_a + this.mass_b))
            + this.g * (this.mass_a + this.mass_b) * cos(this.ang_a)
            + this.vel_b ** 2 * this.len_b * this.mass_b * cos(this.ang_a - this.ang_b);
    }
    den() {
        return 2 * this.mass_a + this.mass_b * (1 - cos(2 * (this.ang_a - this.ang_b)));
    }
    update() {

        let den = this.den();
        let acc_a = this.num_a() / (den * this.len_a);
        let acc_b = this.num_b() / (den * this.len_b);

        this.vel_a += acc_a;
        //this.vel_b += acc_b;
        console.log();

        this.ang_a += this.vel_a;
        this.ang_b += this.vel_b;

        let abx = cos(this.ang_a + this.down) * this.len_a;
        let aby = sin(this.ang_a + this.down) * this.len_a;

        let bcx = cos(this.ang_b + this.down) * this.len_b;
        let bcy = sin(this.ang_b + this.down) * this.len_b;
        //console.log(bcx, bcy, this.ang_b, this.down, this.len_b);

        this.bx = this.ax + abx;
        this.by = this.ay + aby;

        this.cx = this.bx + bcx;
        this.cy = this.by + bcy;

        line(this.ax, this.ay, this.bx, this.by);
        line(this.bx, this.by, this.cx, this.cy);

        circle(this.ax, this.ay, 5);
        circle(this.bx, this.by, this.mass_a);
        circle(this.cx, this.cy, this.mass_b);
    }
}