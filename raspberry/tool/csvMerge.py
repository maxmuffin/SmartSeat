import glob
from tqdm import tqdm

folder = input("Inserisci la cartella contenente i csv da unire (0-8): ")

interesting_files = glob.glob("../dataset/"+folder+"/*.csv")

header_saved = False
with open('../dataset/merged/'+folder+'/outputPosture'+folder+'.csv','w') as fout:
    for filename in tqdm(interesting_files, desc="Merging: "):
        with open(filename) as fin:
            header = next(fin)
            if not header_saved:
                fout.write(header)
                header_saved = True
            for line in fin:
                fout.write(line)
print("###### FINISHED ######")
