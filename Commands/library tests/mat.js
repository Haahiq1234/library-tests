const mat = {
    mult: function(mata, wa, ha, matb, wb, hb) {
        if (wa != hb) {
            console.log("Error: The matrices are not comfortable for multiplication");
        }
    }
}
const mat3 = {
    size: 3,
    size_squared: 9,
    mult: function(a, b) {
        if (a.length != this.size_squared || b.length != this.size_squared) {
            console.log("Matrices are not correct", a, b);
        }
        let ans = new Array(this.size_squared).fill(0);
        for (var i = 0; i < this.size_squared; i++) {
            let x = i % this.size;
            let y = (i - x) / this.size;
            for (var j = 0; j < this.size; j++) {
                ans[i] += a[y * this.size + j] * b[j * this.size + x];
            }
        }
        return ans;
    },
    scale: function(mat, x, y) {
        
    },
    identity: function() {
        return this.scalar(1);
    },
    pos: function(i) {
        let x = i % this.size;
        return [x, (i - x) / this.size];
    },
    scalar: function(s) {
        let m = [];
        for (var i = 0; i < this.size_squared; i++) {
            if (i % (this.size + 1) == 0) {
                m.push(s);
            } else {
                m.push(0);
            }
        }
        return m;
    },
    getFromAngle: function(a) {
        return [cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1];
    }
}