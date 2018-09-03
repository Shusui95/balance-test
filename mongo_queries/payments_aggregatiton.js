db.getCollection('biwengerusers').aggregate([

    {

        $match: { 

            'biwengerId': {

                $ne: -1

            }

        }

    },{

        $lookup: {

            from: 'roundstandings',

            localField: 'biwengerId',

            foreignField: 'biwengerUserId',

            as: 'payments'

        }

    },{

        $project: {

            '_id': 0,

            'biwengerId': 1,

            'name': 1,

            'payment': {

                $reduce: {

                    input: '$payments',

                    initialValue: 0,

                    in: { $add: ['$$value', '$$this.payment'] }

                }

            }

        }

    }

])