# Here go your api methods.
import json

from jikanpy import Jikan
jikan = Jikan()

@auth.requires_login()
def testing():
    #naruto = jikan.anime(20)
    # search = jikan.search('anime', 'naruto')
    # return response.json(dict(search=search))
    db.user_show_list.truncate()
    return "all entries deleted"

@auth.requires_login()
def test_post_entry():
    mal_id = request.vars.mal_id
    title = request.vars.title
    episode_number = request.vars.episode_number
    image_url = request.vars.image_url
    community_score = request.vars.community_score
    list_status = request.vars.list_status
    db.user_show_list.insert(mal_id=mal_id, title=title, episode_number=episode_number, image_url=image_url,
                             community_score=community_score, list_status=list_status)
    return (title + " added to the " + list_status + " list, test_entry")


@auth.requires_login()
def get_watch_list():
    list_category = request.vars.list_category
    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.list_status == list_category))
    show_list = db(q).select()

    return response.json(dict(show_list=show_list))


@auth.requires_login()
def search_for_anime():
    search_word = request.vars.search_term
    search = jikan.search('anime', search_word)

    return response.json(dict(search=search))


@auth.requires_login()
def add_selected_to_planToWatch():
    mal_id = request.vars.mal_id

    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.mal_id == mal_id))
    show_entry = db(q).select()

    if len(show_entry) == 0:
        anime = jikan.anime(mal_id)
        logger.info(type(anime))
        title = anime['title']
        title_en = anime['title_english']
        episode_number = anime['episodes']
        image_url = anime['image_url']
        community_score = anime['score']
        list_status = 'planToWatch'

        db.user_show_list.insert(mal_id=mal_id, title=title, english_title=title_en, episode_number=episode_number, image_url=image_url,
                             community_score=community_score, list_status=list_status)
        # logger.info(type(title))
        # logger.info(title)
        # logger.info(title_en)
        # logger.info(type(episode_number))
        # logger.info(episode_number)
        # logger.info(type(image_url))
        # logger.info(image_url)
        # logger.info(community_score)
        # logger.info(list_status)
    else: 
        # if the anime is already in the database then return
        return response.json(dict(anime=show_entry.first()))
    #add this anime information into the table

    return response.json(dict(anime=anime))


@auth.requires_login()
def add_favorites():
    db_id = request.vars.id
    mal_id = request.vars.mal_id
    # logger.info(db_id)
    # logger.info(mal_id)

    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.id == db_id))

    db(q).update(favorite=True);

    return "show updated: favorite=True"


@auth.requires_login()
def remove_favorites():
    db_id = request.vars.id
    mal_id = request.vars.mal_id
    # logger.info(db_id)
    # logger.info(mal_id)

    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.id == db_id))

    db(q).update(favorite=False);

    return "show updated: favorite=False"


@auth.requires_login()
def get_favorites_list():
    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.favorite == True))
    show_list = db(q).select()

    return response.json(dict(show_list=show_list))


@auth.requires_login()
def get_anime_info():
    mal_id = request.vars.mal_id
    anime_info = jikan.anime(mal_id)

    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.mal_id == mal_id))
    user_anime_info = db(q).select().first()

    return response.json(dict(anime_info=anime_info, user_anime_info=user_anime_info))


@auth.requires_login()
def update_users_stats():
    mal_id = request.vars.mal_id
    episodes = request.vars.episodes_watched
    rating = request.vars.user_rating
    watch_list = request.vars.watch_list
    #there is a chance some of these values are strings when they should be integers

    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.mal_id == mal_id))
    db(q).update(episodes_watched=episodes, user_score=rating, list_status=watch_list)

    user_anime_info = db(q).select().first()

    return response.json(dict(user_anime_info=user_anime_info))


@auth.requires_login()
def get_random_show():
    q = ((db.user_show_list.user_id == auth.user.id) & (db.user_show_list.list_status == 'planToWatch'))
    show = db(q).select(orderby='<random>')

    if len(show) > 0:
        #logger.info(show);
        random_show = show.first()
        # logger.info(random_show)
        # logger.info(random_show.mal_id)
        # anime_info = jikan.anime(random_show.mal_id)
        # return response.json(dict(random_show_user_info=random_show, random_show_full_info=anime_info))
        return random_show.mal_id
    else: 
        nothing_found = -1
        return nothing_found