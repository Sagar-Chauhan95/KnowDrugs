import{a as $,b as j,c as H,d as Q,e as Z,f as q,g as G,h as Y,i as K,j as J,k as tt,l as et}from"./chunk-JTVTGPYP.js";import{a as it}from"./chunk-VX6S6O3F.js";import{b as X}from"./chunk-TEHJRAAM.js";import{a as z}from"./chunk-42T2NVKB.js";import"./chunk-LIAZ27XT.js";import{p as W,t as F}from"./chunk-JYTUQL2Z.js";import{a as L}from"./chunk-N2VS3P45.js";import{e as N,f as B}from"./chunk-G3XZPYES.js";import"./chunk-Q6FBKUVX.js";import"./chunk-WXI33M2S.js";import{Bb as b,Cb as f,Fb as P,Lb as e,Nb as u,Oa as A,Qb as M,Ra as d,Sb as O,_ as w,d as p,da as v,db as D,e as T,f as x,fa as R,ga as C,gc as y,jb as g,lb as k,na as S,oa as E,pb as I,ta as V,tb as s,ub as t,vb as _,yb as U}from"./chunk-BYU4RTY2.js";var st=(()=>{let r=class r{};r.\u0275fac=function(h){return new(h||r)},r.\u0275mod=C({type:r}),r.\u0275inj=w({imports:[W,F]});let n=r;return n})();var nt=n=>["","medicines","details",n,"reviews","add"];function dt(n,r){if(n&1){let l=U();s(0,"div",2)(1,"button",10),b("click",function(){S(l);let h=f();return E(h.update(h.medicationService.$medicine()._id))}),e(2," update "),t(),s(3,"button",10),b("click",function(){S(l);let h=f();return E(h.delete(h.medicationService.$medicine()._id))}),e(4," delete "),t()()}}function lt(n,r){if(n&1&&(s(0,"p")(1,"a",11),e(2,"Add Review"),t()()),n&2){let l=f();d(),k("routerLink",O(1,nt,l.medicationService.$medicine()._id))}}var Gt=(()=>{var r,l;let c=class c{constructor(){T(this,r);T(this,l);this.medicine_id=V.required(),this.medicationService=v(z),x(this,r,v(N)),x(this,l,v(L)),this.authService=v(X),this.reviewService=v(it),this.$average_rating=D(0),y(()=>{this.medicationService.$medicine()}),y(()=>{this.$average_rating()})}formatLabel(a){return a>=1e3?Math.round(a/1e3)+"k":`${a}`}ngAfterViewInit(){this.medicationService.getMedicationById(this.medicine_id()).subscribe(a=>{if(a.success){this.medicationService.$medicine.set(a.data);let o=[...this.medicationService.$medicine().reviews];if(o.length>0){let i=o.reduce((m,rt)=>m+Number(rt.rating),0);this.$average_rating.set(Math.floor(i/o.length))}else this.$average_rating.set(0)}})}update(a){p(this,r).navigate(["","medicines","update",a])}delete(a){this.medicationService.deleteMedicationById(a).subscribe({next:o=>{o.data&&(this.medicationService.$medications.update(i=>i.filter(m=>m._id!==a)),p(this,l).success("Medication successfully deleted"),p(this,r).navigate(["","medicines_letters"],{queryParams:{text:this.medicationService.$medicine().first_letter}}))},error:o=>{p(this,l).error("Medication deletion Unsuccessfull")}})}goToReview(a){p(this,r).navigate(["","medicines","details",a,"reviews"])}};r=new WeakMap,l=new WeakMap,c.\u0275fac=function(o){return new(o||c)},c.\u0275cmp=R({type:c,selectors:[["app-medication-details"]],inputs:{medicine_id:[1,"medicine_id"]},standalone:!0,features:[M],decls:46,vars:10,consts:[[1,"container"],[1,"firstSubcontainer"],[1,"updateButton"],[1,"secondSubContainer"],[1,"example-card"],["mat-button",""],["mat-card-image","","alt","Image",3,"src"],[1,"progressBar"],["mode","determinate",3,"value"],["mat-button","",3,"click"],[3,"click"],[2,"text-decoration","none",3,"routerLink"]],template:function(o,i){if(o&1&&(s(0,"div",0)(1,"div",1)(2,"div")(3,"b"),e(4),t(),_(5,"br"),s(6,"b"),e(7,"Generic name: \xA0"),t(),s(8,"span"),e(9),t(),_(10,"br"),s(11,"b"),e(12,"Drug Class: \xA0"),t(),s(13,"span"),e(14),t()(),g(15,dt,5,0,"div",2),t(),s(16,"div",3)(17,"mat-card",4)(18,"mat-card-header")(19,"mat-card-title"),e(20,"Drug Status"),t(),s(21,"mat-card-actions")(22,"mat-card-subtitle")(23,"button",5),e(24,"Availability"),t(),s(25,"button",5),e(26),t()()()(),_(27,"br"),e(28," Image "),_(29,"img",6),s(30,"mat-card-content")(31,"p"),e(32,"Description"),t()(),s(33,"mat-card-actions")(34,"mat-card-content")(35,"p"),e(36,"User Reviews & Ratings"),t(),s(37,"div",7)(38,"b"),e(39),t(),_(40,"mat-progress-bar",8),t(),s(41,"b"),e(42),t(),s(43,"button",9),b("click",function(){return i.goToReview(i.medicationService.$medicine()._id)}),e(44," Reviews "),t(),g(45,lt,3,3,"p"),t()()()()()),o&2){let m;d(4),u("",i.medicationService.$medicine().name," "),d(5),u("",i.medicationService.$medicine().generic_name," "),d(5),u(" ",i.medicationService.$medicine().medication_class,""),d(),I(i.authService.is_logged_in()&&i.authService.$state()._id===i.medicationService.$medicine().added_by.user_id?15:-1),d(11),u(" ",i.medicationService.$medicine().availability," "),d(3),P("src",(m=i.medicationService.$medicine().image)==null?null:m.originalname,A),d(10),u("",i.$average_rating(),"/10"),d(),k("value",i.$average_rating()*10),d(2),u("",i.medicationService.$medicine().reviews.length," "),d(3),I(i.authService.is_logged_in()?45:-1)}},dependencies:[B,j,$,J,H,G,Z,Y,K,q,Q,st,et,tt],styles:[".container[_ngcontent-%COMP%]{margin-left:10%;margin-top:25px;display:grid;grid-template-columns:35% 65%}.example-card[_ngcontent-%COMP%]{max-width:400px}.example-header-image[_ngcontent-%COMP%]{background-image:url(https://material.angular.io/assets/img/examples/shiba1.jpg);background-size:cover}.updateButton[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:80px;height:35px;font-size:16px;border-radius:8px;margin-right:25px;background-color:#568de4;color:#fff;margin-top:80px}mat-slider[_ngcontent-%COMP%]{width:300px}.mat-progress-bar[_ngcontent-%COMP%]{width:300px}.progressBar[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:10px}"]});let n=c;return n})();export{Gt as MedicationDetailsComponent};