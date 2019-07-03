import qs from 'qs'
import { mapState } from 'vuex'
import config from '@/config'
import { swapArray } from '@/libs/util'
import { getAxiosData, deleteDataId, postAxiosData, putAxiosData } from '@/api/axiosType'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
  data () {
    return {
       sharp:require('@/assets/images/sharp.svg'),
       sharpChosen:require('@/assets/images/sharpChosen.svg'),
       classNameE: 'squera_p',
       classNameT: 'squera',
        tableShow: false
    }
  },
  computed: {

  },
  methods: {
    initDraw(){
        const that = this
        var wId = "addImage";

        var index = 0;

        var startX = 0, startY = 0;

        var flag = false;

        var retcLeft = "0px", retcTop = "0px", retcHeight = "0px", retcWidth = "0px";

        document.onmousedown = function(e){
            if(e.target.className.indexOf('real')>-1){
                return
            }
            // for(let i=0; i<document.getElementsByClassName('addImage').length;i++){
            //     document.getElementsByClassName('addImage')[i].remove()
            // }
            // document.getElementsByClassName('addImage')[0].remove()
            if(e)
            if(that.active == -1 || that.active == undefined){
              return
            }
            flag = true;

            try{

                var evt = window.event || e;

                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

                startX = evt.clientX + scrollLeft;

                startY = evt.clientY + scrollTop;

                index++;

                var p = document.createElement("p");

                p.id = wId + index;

                p.className = that.classNameE+'  '+wId;

                p.style.left = startX + "px";

                p.style.top = startY + "px";

                document.body.appendChild(p);

            }catch(e){

                //alert(e);

            }

        }

        document.onmouseup = function(){
            if(that.active == -1 || that.active == undefined){
                return
            }
            if(document.getElementsByClassName('addImage').length)
                that.tableShow = true
            else
                that.tableShow = false
            try{

                document.body.removeChild($(wId + index));

                var p = document.createElement("p");

                p.className = that.classNameT+'  '+wId;

                p.style.left = retcLeft;

                p.style.top = retcTop;

                p.style.width = retcWidth;

                p.style.height = retcWidth;

                document.body.appendChild(p);

            }catch(e){

                //alert(e);

            }
            that.active = -1
            flag = false;
        }

        document.onmousemove = function(e){
            if(e.target.className.indexOf('real')>-1){
                return
            }
            if(that.active == -1){
                return
            }
            if(flag){

                try{

                    var evt = window.event || e;

                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                    var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

                    retcLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX) + "px";

                    retcTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY) + "px";

                    retcHeight = Math.abs(startY - evt.clientY - scrollTop) + "px";

                    retcWidth = Math.abs(startX - evt.clientX - scrollLeft) + "px";

                    $(wId + index).style.left = retcLeft;

                    $(wId + index).style.top = retcTop;

                    $(wId + index).style.width = retcWidth;

                    $(wId + index).style.height = retcWidth;

                }catch(e){

                    //alert(e);

                }

            }

        }

        var $ = function(id){

            return document.getElementById(id);

        }
    }
  },
  mounted () {
      const that = this
      that.initDraw()
  }
}