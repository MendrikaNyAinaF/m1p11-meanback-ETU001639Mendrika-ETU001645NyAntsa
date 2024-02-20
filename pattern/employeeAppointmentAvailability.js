const search_pattern = (date_heure_debut, enddate, detail) => {
    return {
        "$and": [
            {
                "$or": [
                    {
                        "$and": [
                            {
                                date_heure_debut: {"$lte": date_heure_debut}
                            }
                            ,
                            {
                                date_heure_fin: {"$gt": date_heure_debut}
                            }
                        ]
                    }
                    ,
                    {

                        "$and": [
                            {
                                date_heure_debut: {"$lte": enddate}
                            }
                            ,
                            {
                                date_heure_fin: {"$gt": enddate}
                            }
                        ]
                    }
                ]
            },
            {
                employee: detail.employee
            }
        ]
    }
}

exports.search_pattern = search_pattern;