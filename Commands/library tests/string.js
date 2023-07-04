
const stringMath = {
    blend: function (no1, no2) {
        let decimal1 = no1.indexOf(".");
        let d1 = decimal1;
        if (decimal1 < 0) {
            d1 = no1.length;
            no1 += ".";
        }
        let decimal2 = no2.indexOf(".");
        let d2 = decimal2;
        if (decimal2 < 0) {
            d2 = no2.length;
            no2 += ".";
        }
        let dp1 = no1.length - d1 - 1;
        let dp2 = no2.length - d2 - 1;
        if (d1 < d2) {
            for (var i = 0; i < d2 - d1; i++) {
                no1 = "0" + no1;
            }
        }
        if (d2 < d1) {
            for (var i = 0; i < d1 - d2; i++) {
                no2 = "0" + no2;
            }
        }
        if (dp1 < dp2) {
            for (var i = 0; i < dp2 - dp1; i++) {
                no1 += "0";
            }
        }
        if (dp2 < dp1) {
            for (var i = 0; i < dp1 - dp2; i++) {
                no2 += "0";
            }
        }
        //console.log(d1, d2);
        //console.log(dp1, dp2);
        //console.log(no1, no2);
        return [no1, no2];
    },
    sub: function (na, nb) {
        let ns = this.blend(na, nb);
        na = ns[0];
        nb = ns[1];

        let d = na.indexOf(".");

        na = na.replace(".", "");
        nb = nb.replace(".", "");

        let pos = "";
        let neg = "";

        for (var i = 0; i < na.length; i++) {
            let a = parseInt(na[i]);
            let b = parseInt(nb[i]);
            let sum = a - b;
            if (sum < 0) {
                neg += "" + (-sum);
                pos += "0";
            } else {
                pos += "" + sum;
                neg += "0";
            }
        }

        let preOff = "";
        let mn = neg;
        let mx = pos;
        if (Equality.relation(neg, pos) == Equality.Greater) {
            preOff = "-"
            mx = neg;
            mn = pos;
        }
        let ans = mx;
        for (var i = mn.length - 1; i >= 0; i--) {
            let a = parseInt(mn[i]);

            if (a > 0) {
                let b1 = parseInt(ans[i]);
                if (b1 > 0 && b1 >= a) {
                    a = b1 - a;
                } else if (b1 > 0 && b1 < a) {
                    a = 10 + b1 - a;
                } else {
                    a = 10 - a;
                }
                let j2 = i;
                for (var j = i; j >= 0; j--) {
                    let b = parseInt(ans[j]);
                    if (b > 0) {
                        j2 = j;
                        b--;
                        ans = replaceAt(ans, b, j);
                        break;
                    }
                }
                ans = replaceAt(ans, a, i);
                for (var j = j2 + 1; j < i; j++) {
                    ans = replaceAt(ans, "9", j);
                }
            }
        }
        if (d >= 0 && d < ans.length) {
            ans = insertAt(ans, ".", d);
        }
        return preOff + ans;
    },
    trim: function (n) {
        for (var i = 0; i < n.length; i++) {
            if (n[i] == 0) {
                n = n.slice(1, n.length);
            } else {
                break;
            }
        }
        for (var i = n.length - 1; i >= 0; i--) {
            if (n[i] == 0) {
                n = n.slice(0, n.length - 1);
            } else {
                break;
            }
        }
        if (n[n.length - 1] == ".") {
            n = n.slice(0, n.length - 1);
        }
        //console.log(n);
        return n;
    },
    add: function (na, nb) {
        let ns = this.blend(na, nb);
        na = ns[0];
        nb = ns[1];

        let d = na.indexOf(".");
        na = na.replace(".", "");
        nb = nb.replace(".", "");
        let carry = "";
        let ans = "";
        for (var i = na.length - 1; i >= 0; i--) {
            let a = parseInt(na[i]);
            let b = parseInt(nb[i]);
            //console.log(a, b);
            if (parseInt) {

            }
            let sum = a + b;
            if (i < na.length - 1) {
                sum = parseInt(carry[0]) + sum;
            }
            let m = floorDiv(sum, 10);
            carry = "" + m + carry;
            sum -= m * 10;
            //console.log(sum, m);
            ans = "" + sum + ans;
        }
        //console.log(ans);
        if (d < ans.length) {
            ans = insertAt(ans, ".", d);
        }
        //console.log(ans);
        let c = parseInt(carry[0]);
        if (c > 0) {
            ans = "" + c + ans;
        }


        //console.log(na, nb, ans, carry);
        return ans;

    },
    mult: function (na, nb) {
        let ns = this.blend(na, nb);
        na = ns[0];
        nb = ns[1];
        //console.log(na);
        //console.log(nb);
        let d = na.indexOf(".");
        let id = (nb.length - d - 1) * 2;

        na = na.replace(".", "");
        nb = nb.replace(".", "");
        let arr = [];
        let lstn;
        for (var i = na.length - 1; i >= 0; i--) {
            let ii = na.length - i;
            let a = na[i];
            //console.log(nb, a);
            let sum = this.multnv1(a, nb);
            //console.log(sum);
            for (var j = 0; j < ii - 1; j++) {
                sum = sum + "0";
            }
            arr.push(sum);
        }
        //let lsts = arr[arr.length - 1];
        //if (lsts.length > d) {
        //    id++;
        //}

        let ans = "";
        for (var i = 0; i < arr.length; i++) {
            ans = this.add(ans, arr[i]);
            //console.log(arr[i]);
        }
        //console.log(d * 2 - nb.length, id);
        ans = insertAt(ans, ".", ans.length - id);
        return ans;
    },
    multnv1: function (n, na) {
        let d = na.indexOf(".");
        na = na.replace(".", "");
        let carry = "";
        let ans = "";
        let b = parseInt(n);
        for (var i = na.length - 1; i >= 0; i--) {
            let a = parseInt(na[i]);
            let sum = a * b;
            if (i < na.length - 1) {
                sum = parseInt(carry[0]) + sum;
            }
            let m = floorDiv(sum, 10);
            carry = "" + m + carry;
            sum -= m * 10;
            //console.log(sum, m);
            ans = "" + sum + ans;
        }
        //console.log(ans);
        if (d < ans.length && d >= 0) {
            ans = insertAt(ans, ".", d);
        }
        let c = parseInt(carry[0]);
        if (c > 0) {
            ans = "" + c + ans;
        }


        //console.log(na, nb, ans, carry);
        return ans;
    },
    getDec: function (no) {
        let d = no.indexOf(".");
        if (d < 0) {
            d = no.length;
        }
        return d;
    },
    addZeros: function (no, noToMatch) {
        let st = no.length;
        let en = ((this.getDec(noToMatch)) - st);
        //console.log(st, getDec(noToMatch), en);
        for (var i = 0; i < en; i++) {
            no += "0";
        }
        //console.log(no);
        if (en < 0) {
            no = insertAt(no, ".", this.getDec(noToMatch));
        }
        return no;
    },
    div: function (no, divi) {
        let ans = "";
        let d = this.getDec(no);
        var lst = "0";
        for (var i = 0; i < no.length + 100; i++) {
            //console.log(i);
            for (var j = 0; j < 10; j++) {
                let a = this.addZeros(ans + j, no);
                let num = this.mult(a, divi);
                if (Equality.relation(num, no) == Equality.Greater) {
                    break;
                }
                lst = j;
            }
            ans += lst;
        }
        //return;
        //console.log(lst);
        lst = "0";
        return insertAt(ans, ".", d);
    },
    sqrt: function (no) {
        let ans = "";
        let d = this.getDec(no);
        var lst = "0";
        for (var i = 0; i < no.length + 100; i++) {
            //console.log(i);
            for (var j = 0; j < 10; j++) {
                let a = this.addZeros(ans + j, no);
                let num = this.mult(a, a);
                let rel = Equality.relation(num, no);
                //console.log();
                if (rel == Equality.Equal) {
                    return a;
                }
                if (rel == Equality.Greater) {
                    break;
                }
                lst = j;
            }
            ans += lst;
        }
        //return;
        //console.log(lst);
        lst = "0";
        return insertAt(ans, ".", d);
    },
    powint: function (no, p) {
        let num = "1";
        for (var i = 0; i < parseInt(p); i++) {
            num = this.mult(num, no);
        }
        return num;
    }
};
Object.freeze(stringMath);
const Equality = {
    relation: function (a, b) {
        let ns = this.blend(a, b);
        a = ns[0];
        b = ns[1];
        for (var i = 0; i < a.length; i++) {
            if (a[i] == b[i]) {
                continue;
            } else if (a[i] < b[i]) {
                return this.Lesser;
            } else {
                return this.Greater;
            }
        }
        return this.Equal;
    },
    Equal: 0,
    Greater: 1,
    Lesser: 2,
};
Object.freeze(Equality);