// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    /**
     *
     * @param page name of selected page
     * @param event reference to clicked tab, used to change its color
     */
    self.tab_clicked = function(page, event){
        console.log("Selected Page: " + page);
        self.vue.current_page = page;
        self.change_color(page, event.target);
        self.get_watch_list(page);
        //console.log(event.target);
    };

    // changes the color of the tabs to white but leaves the targeted tag colored
    self.change_color = function(page, eventTarget){
        let i, tablinks;
        tablinks = document.getElementsByClassName("tab_link");
        for(i = 0; i < tablinks.length; i++){
            tablinks[i].style.backgroundColor = "white";
            tablinks[i].style.border = "none";
        }
        eventTarget.style.backgroundColor = "#E1E7F5";
    };

    /**
     * Determines what happens when a menu button is pressed
     * @param  {string} page name of the page ex: "home", "watching", "search"
     */
    self.menu_button_clicked = function(page){
        console.log("Selected Page: " + page);
        // if home was clicked then we default to Watching
        if(page === "home"){
            self.vue.current_page = 'watching';
            self.get_watch_list('watching');
            setTimeout(function () {
                // This will act like 'watching' tab was selected
                document.getElementById("initial").click();
            }, 1000);

        }else if(page === "search"){
            self.vue.current_page = page;
            self.vue.input_search = "";

        }else if(page === "favorites"){
            self.vue.current_page = page;
            self.get_favorites_list();

        }else{
            self.vue.current_page = page;
        }
    };

    self.info_button_clicked = function(mal_id){
        console.log("getting info for " + mal_id);
        self.vue.current_page = "infoPage";

        let data_obj = {
            mal_id: mal_id
        }
        $.getJSON(
            get_anime_info_url,
            data_obj,
            function(anime){
                self.vue.specified_anime = anime.anime_info;
                console.log("Anime info retrieved: ");
                console.log(self.vue.specified_anime);
            }
        );
    }

    // for testing
    self.test_api = function(){
        console.log("about to call the api");
        // this will delete all entries in the user_show_list table
        $.post(
            //'https://api.jikan.moe/anime/20/episodes',
            //'http://api.jikan.moe/search/anime/naruto',
            test_url,
            function(success){
                console.log("returned from api call");
                console.log(success);
            }
        );
    };

    // for testing: adds a specific entry of data 
    self.test_post_entry = function(){
        console.log("adding a test entry manually");
        let data_obj = {
            mal_id: 1,
            title: "Cowboy Bebop",
            episode_number: 26,
            image_url: "https://myanimelist.cdn-dena.com/images/anime/4/19644.jpg",
            community_score: 8.81,
            list_status: "planToWatch"
        };
        $.post(
            test_post_entry_url,
            data_obj,
            function(success){
                console.log("added the test anime");
                console.log(success);
            }
        )
    };

    /**
     * gets the list of shows for the given list_category
     * @param  {string} list_category is one of 5 categories: watching, planToWatch, onHold, completed, dropped
     */
    self.get_watch_list = function(list_category){
        console.log("getting watching list");
        let data_obj = {
            list_category: list_category
        };
        $.getJSON(
            get_watch_list_url,
            data_obj,
            function(list){
                if(list_category === "watching") {
                    self.vue.watching = list.show_list;
                    console.log(self.vue.watching);
                }else if(list_category === "planToWatch") {
                    self.vue.planToWatch = list.show_list;
                    console.log(self.vue.planToWatch);
                }else if(list_category === "onHold") {
                    self.vue.onHold = list.show_list;
                    console.log(self.vue.onHold);
                }else if(list_category === "completed") {
                    self.vue.completed = list.show_list;
                    console.log(self.vue.completed);
                }else if(list_category === "dropped") {
                    self.vue.dropped = list.show_list;
                    console.log(self.vue.dropped);
                }else {
                    console.error(list_category + "is not a correct list name");
                }
                console.log(list_category + "list updated");
            }
        );
    };

    /**
     * searches for an anime based on the vue variable input_search
     */
    self.search_for_anime = function(){
        if(self.vue.input_search.length >= 4 ){

            let data_obj = {
                search_term: self.vue.input_search
            };
            $.getJSON(
                search_for_anime_url,
                data_obj,
                function(list){
                    self.vue.searched_anime = list.search.result;
                    //console.log(self.vue.searched_anime);
                }
            );

        }else{
            console.log("search string is less than 3");
        }
    };

    /**
     * adds an anime that the user has requested be on their list
     * @param {[type]} mal_id [description]
     * @param {[type]} index  [description]
     */
    self.add_selected_to_planToWatch = function(mal_id, index){
        let data_obj = {
            mal_id: mal_id,
        };
        console.log("plus clicked: " + mal_id + ", " + index);
        $.getJSON(
            add_selected_to_planToWatch_url,
            data_obj,
            function(success){
                console.log("Anime you want to Add");
                console.log(success.anime);
            });
    };

    self.add_favorites = function(id, mal_id, index, current_page){
        let data_obj = {
            id: id,
            mal_id: mal_id,
            index: index,
        }
        console.log("Before adding anime to Favorites");
        $.post(
            add_favorites_url,
            data_obj,
            function(success){
                console.log("Finished adding to Favorites")
                if(current_page === 'planToWatch'){
                    let temp = self.vue.planToWatch[index];
                    temp.favorite = true;
                    Vue.set(self.vue.planToWatch, index, temp);
                }else if(current_page === 'watching'){
                    let temp = self.vue.watching[index];
                    temp.favorite = true;
                    Vue.set(self.vue.watching, index, temp);
                }else if(current_page === 'onHold'){
                    let temp = self.vue.onHold[index];
                    temp.favorite = true;
                    Vue.set(self.vue.onHold, index, temp);
                }else if(current_page === 'completed'){
                    let temp = self.vue.completed[index];
                    temp.favorite = true;
                    Vue.set(self.vue.completed, index, temp);
                }else if(current_page === 'dropped'){
                    let temp = self.vue.dropped[index];
                    temp.favorite = true;
                    Vue.set(self.vue.dropped, index, temp);
                }else if(current_page === 'favorites'){
                    let temp = self.vue.favorites[index];
                    temp.favorite = true;
                    Vue.set(self.vue.favorites, index, temp);
                }else{
                    console.error("current_page is not a valid page: " + current_page);
                }
            });
    };

    self.remove_favorites = function(id, mal_id, index, current_page){
        let data_obj = {
            id: id,
            mal_id: mal_id,
            index: index,
        }
        console.log("Before removing from favorite");
        $.post(
            remove_favorites_url,
            data_obj,
            function(success){
                console.log("Finished removing from favorite");
                if(current_page === 'planToWatch'){
                    let temp = self.vue.planToWatch[index];
                    temp.favorite = false;
                    Vue.set(self.vue.planToWatch, index, temp);
                }else if(current_page === 'watching'){
                    let temp = self.vue.watching[index];
                    temp.favorite = false;
                    Vue.set(self.vue.watching, index, temp);
                }else if(current_page === 'onHold'){
                    let temp = self.vue.onHold[index];
                    temp.favorite = false;
                    Vue.set(self.vue.onHold, index, temp);
                }else if(current_page === 'completed'){
                    let temp = self.vue.completed[index];
                    temp.favorite = false;
                    Vue.set(self.vue.completed, index, temp);
                }else if(current_page === 'dropped'){
                    let temp = self.vue.dropped[index];
                    temp.favorite = false;
                    Vue.set(self.vue.dropped, index, temp);
                }else if(current_page === 'favorites'){
                    let temp = self.vue.favorites[index]
                    temp.favorite = false;
                    Vue.set(self.vue.favorites, index, temp);
                }else{
                    console.error("current_page is not a valid page: " + current_page);
                }
            });
    };

    self.get_favorites_list = function(){
        console.log("getting Favorites list");

        $.getJSON(
            get_favorites_list_url,
            function(list){
                console.log("retrieved favorite shows");
                self.vue.favorites = list.show_list;
                console.log(self.vue.favorites);
            }
        );
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            current_page: 'watching', // watching, planToWatch, onHold, completed, dropped, favorites, infoPage
            watching: [],
            planToWatch: [],
            onHold: [],
            completed: [],
            dropped: [],
            input_search: "",
            searched_anime: [],
            favorites:[],
            specified_anime: "",
        },
        methods: {
            tab_clicked: self.tab_clicked,
            menu_button_clicked: self.menu_button_clicked,
            get_watch_list: self.get_watch_list,
            search_for_anime: self.search_for_anime,
            add_selected_to_planToWatch: self.add_selected_to_planToWatch,
            add_favorites: self.add_favorites,
            remove_favorites: self.remove_favorites,
            info_button_clicked: self.info_button_clicked,
            test_api: self.test_api,
            test_post_entry: self.test_post_entry,
        }

    });

    if( user_logged_in ){document.getElementById("initial").click();}
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
