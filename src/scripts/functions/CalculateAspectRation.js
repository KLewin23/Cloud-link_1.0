function gcd(a,b) {if(b>a) {const temp = a; a = b; b = temp} while(b!=0) {const m=a%b; a=b; b=m;} return a;}

export default function ratio(x,y) {const c=gcd(x,y); return [(x/c),(y/c)]};